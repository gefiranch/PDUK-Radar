import {getSession,json,apiError} from '../../../lib/auth/session';
import {cases} from '../../../lib/cases/server';
export const dynamic='force-dynamic';
export async function GET(){try{await getSession();return json({records:await cases().list()});}catch(e){return apiError(e);}}
