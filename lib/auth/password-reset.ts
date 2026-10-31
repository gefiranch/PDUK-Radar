import {AccessError,validatePassword} from './policy.ts';
export function validatePasswordReset(body:unknown){
 if(!body||typeof body!=='object'||Array.isArray(body))throw new AccessError(400,'Format penggantian kata sandi tidak valid.');
 const b=body as Record<string,unknown>;
 if(b.action!=='reset-password'||Object.keys(b).some(k=>!['action','password','confirmPassword'].includes(k)))throw new AccessError(400,'Hanya kata sandi yang dapat diubah melalui tindakan ini.');
 const password=validatePassword(b.password);
 if(!password.trim())throw new AccessError(400,'Kata sandi tidak boleh hanya berisi spasi.');
 if(b.confirmPassword!==password)throw new AccessError(400,'Konfirmasi kata sandi tidak sama.');
 return {password};
}
