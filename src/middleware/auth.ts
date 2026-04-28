import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
import {type Request,type Response,type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId:string,
      auth0Id:string
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE||'',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL||'',
  tokenSigningAlg: 'RS256'
});
//funcion para analizar el token de inicio de sesion para validar que sea correcto
export const jwtParse = async (req:Request, res:Response, next:NextFunction):Promise<any>=>{
  const {authorization} = req.headers;
  //los headers comenzaran con una cadena
  //Bearer token
  //Verificar que la autorizacion comience con la cadena Bearer
  if(!authorization||!authorization.startsWith('Bearer ')){
    console.log('jwtParse - Autorizacion denegada');
    return res.status(401).json({message:'Autorizacion denegada'});
  }
  //obtenemos el token del header
  //split = ["Bearer","Token"]
  //split divide por el caracter espacio " " la cadena
  const token = authorization.split(" ")[1] as string;
  try {
    console.log("jwtParse - Analizando token");
    //Analizamos el token para verificar que sea correcto
    //Decoded decofifica el token dividiendolo en partes
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    //el elemento sub del token contiene el id del usuario
    const auth0Id = decoded.sub||'';
    //buscamos el usuario en la base de datos
    const user = await userModel.findOne({auth0Id});
    if(!user){
      console.log("jwtParse - user encontrado - Autorizacion denegada");
      return res.status(401).json({message:'Autorizacion denegada'});
    }
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    console.log("jwtParse - user encontrado - Autorizacion concedida");
    next();
    
  } catch (error) {
    console.log(error);
    
  }
    
}