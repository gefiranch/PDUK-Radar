import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePasswordReset} from '../lib/auth/password-reset.ts';
import {initializeTheme} from '../public/ui/src/services/theme.js';
import {UserManagement} from '../public/ui/src/pages/UserManagement.js';
import {Login} from '../public/ui/src/pages/Login.js';
test('password reset requires confirmation, limits and strict fields',()=>{
 assert.deepEqual(validatePasswordReset({action:'reset-password',password:'fixture-new-pass',confirmPassword:'fixture-new-pass'}),{password:'fixture-new-pass'});
 for(const value of [null,[],{},...['short','      ','a'.repeat(129)].map(password=>({action:'reset-password',password,confirmPassword:password})),{action:'reset-password',password:'fixture-password',confirmPassword:'wrong'},{action:'reset-password',password:'fixture-password',confirmPassword:'fixture-password',role:'admin'}])assert.throws(()=>validatePasswordReset(value));
});
test('dark appearance ignores legacy light preference and unavailable browser storage',()=>{
 const root={dataset:{theme:'light'},style:{colorScheme:'light'}};
 const legacy={getItem:()=> 'light',setItem(){throw Error('Storage must not be needed');}};
 assert.equal(initializeTheme({root,storage:legacy,prefersDark:false}),'dark');
 assert.equal(root.dataset.theme,'dark');assert.equal(root.style.colorScheme,'dark');
 const denied={getItem(){throw Error('Denied');},setItem(){throw Error('Denied');}};
 assert.equal(initializeTheme({root,storage:denied,prefersDark:false}),'dark');
});
test('account actions expose reset for admin and user, without embedding passwords',()=>{
 const users=[{id:'a',name:'Admin',email:'a@example.test',role:'admin',status:'active'},{id:'u',name:'User',email:'u@example.test',role:'user',status:'active'}];const html=UserManagement({users,loaded:true});assert.equal((html.match(/data-action="reset-user-password"/g)||[]).length,2);assert.ok(!html.includes('${'));assert.doesNotMatch(Login(),/toggle-theme|login-theme-bar|Employer Risk Intelligence/);assert.match(Login(),/autocomplete="current-password"/);
});
