import {ensureTestAccounts} from '../lib/auth/test-accounts.ts';
import {getSql} from '../db/index.ts';
try{
 if(!process.env.PDUK_TEST_ADMIN_PASSWORD)throw Error('Isi PDUK_TEST_ADMIN_PASSWORD di .env.local terlebih dahulu.');
 await ensureTestAccounts();
 console.log('Akun awal siap. Password akun yang sudah ada tidak ditimpa.');
}catch{console.error('Seed gagal. Periksa DATABASE_URL, tabel SQL, dan password awal (minimal 6 karakter).');process.exitCode=1;}
finally{if(process.env.DATABASE_URL)await getSql().end({timeout:5});}
