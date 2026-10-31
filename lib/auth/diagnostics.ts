// Only fixed diagnostic labels reach logs. Never log Error objects, SQL, params or URLs.
const hints:Record<string,string>={
 '28P01':'Database menolak username/password. Periksa kredensial database dan URL encoding.',
 '28000':'Identitas database atau pooler tidak valid. Periksa username dan project reference.',
 '3D000':'Nama database tidak ditemukan.',
 '42P01':'Tabel belum ditemukan. Jalankan supabase/001_setup.sql pada project yang terhubung.',
 '42703':'Kolom database tidak sesuai schema aplikasi.',
 '42501':'Role koneksi database tidak memiliki izin yang diperlukan.',
 '23505':'Terjadi konflik data unik di database.',
 'ENOTFOUND':'Hostname database tidak dapat ditemukan.',
 'EAI_AGAIN':'DNS database sementara tidak dapat diakses.',
 'ENETUNREACH':'Jaringan database tidak terjangkau. Periksa penggunaan pooler IPv4.',
 'ECONNREFUSED':'Koneksi database ditolak. Periksa host dan port.',
 'ETIMEDOUT':'Koneksi database melewati batas waktu.',
 'CONNECT_TIMEOUT':'Koneksi database melewati batas waktu.',
 'CONNECTION_CLOSED':'Koneksi database ditutup.',
 'ERR_INVALID_URL':'Format DATABASE_URL tidak valid.',
 'SELF_SIGNED_CERT_IN_CHAIN':'Validasi sertifikat TLS database gagal.',
 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':'Validasi sertifikat TLS database gagal.',
 'DEPTH_ZERO_SELF_SIGNED_CERT':'Validasi sertifikat TLS database gagal.'
};
export function diagnosticSummary(error:unknown,databaseUrl=process.env.DATABASE_URL){
 let code='UNKNOWN';let current:unknown=error;const seen=new Set();
 for(let depth=0;depth<6&&current&&typeof current==='object'&&!seen.has(current);depth++){
  seen.add(current);const e=current as {code?:unknown;message?:unknown;cause?:unknown};
  if(typeof e.code==='string'&&Object.hasOwn(hints,e.code))code=e.code;
  // Some pooler errors use nonstandard codes; match known phrases without logging messages.
  if(code==='UNKNOWN'&&typeof e.message==='string'&&/tenant or user not found/i.test(e.message))code='28000';
  current=e.cause;
 }
 if(!databaseUrl)code='DATABASE_URL_MISSING';
 let connection='missing';
 if(databaseUrl){try{const url=new URL(databaseUrl);connection=['postgres:','postgresql:'].includes(url.protocol)?(url.hostname.endsWith('.pooler.supabase.com')?'supabase-pooler':'postgres-other-host'):'invalid-protocol';}catch{connection='invalid-url';code='ERR_INVALID_URL';}}
 return {code,connection,hint:code==='DATABASE_URL_MISSING'?'DATABASE_URL belum tersedia pada deployment ini.':hints[code]??'Error belum terklasifikasi. Periksa konfigurasi database dan schema; detail sensitif tidak dicatat.'};
}
