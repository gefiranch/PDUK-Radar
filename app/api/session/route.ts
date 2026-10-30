import {getSession,publicUser,json,apiError} from '../../../lib/auth/session';
export const dynamic='force-dynamic';
export async function GET(){try{const s=await getSession();return json({user:publicUser(s.user)});}catch(e){return apiError(e);}}
