import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePasswordReset} from '../lib/auth/password-reset.ts';
import {initializeTheme,setTheme,resolveTheme,THEME_KEY} from '../public/ui/src/services/theme.js';
import {UserManagement} from '../public/ui/src/pages/UserManagement.js';
import {Login} from '../public/ui/src/pages/Login.js';
test('password reset requires confirmation, limits and strict fields',()=>{
 assert.deepEqual(validatePasswordReset({action:'reset-password',password:'fixture-new-pass',confirmPassword:'fixture-new-pass'}),{password:'fixture-new-pass'});
 for(const value of [null,[],{},...['short','      ','a'.repeat(129)].map(password=>({action:'reset-password',password,confirmPassword:password})),{action:'reset-password',password:'fixture-password',confirmPassword:'wrong'},{action:'reset-password',password:'fixture-password',confirmPassword:'fixture-password',role:'admin'}])assert.throws(()=>validatePasswordReset(value));
});
test('theme resolves system fallback, persists choice and handles disabled browser storage',()=>{
 const root={dataset:{},style:{}},map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 assert.equal(resolveTheme('invalid',true),'dark');assert.equal(resolveTheme('light',true),'light');
 assert.equal(initializeTheme({root,storage,prefersDark:true}),'dark');setTheme('light',{root,storage});assert.equal(root.dataset.theme,'light');assert.equal(root.style.colorScheme,'light');assert.equal(map.get(THEME_KEY),'light');assert.equal(initializeTheme({root,storage,prefersDark:true}),'light');
 const denied={getItem(){throw Error('Denied');},setItem(){throw Error('Denied');}};assert.equal(initializeTheme({root,storage:denied,prefersDark:false}),'light');assert.equal(setTheme('dark',{root,storage:denied}),'dark');assert.throws(()=>setTheme('other',{root,storage}));
});
test('account actions expose reset for admin and user, without embedding passwords',()=>{
 const users=[{id:'a',name:'Admin',email:'a@example.test',role:'admin',status:'active'},{id:'u',name:'User',email:'u@example.test',role:'user',status:'active'}];const html=UserManagement({users,loaded:true});assert.equal((html.match(/data-action="reset-user-password"/g)||[]).length,2);assert.ok(!html.includes('${'));assert.match(Login(),/data-action="toggle-theme"/);assert.match(Login(),/autocomplete="current-password"/);
});
