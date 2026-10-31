// One appearance across login, workspace, and first paint. Legacy saved choices are ignored.
export function initializeTheme({root=document.documentElement}={}){
 root.dataset.theme='dark';root.style.colorScheme='dark';return 'dark';
}
