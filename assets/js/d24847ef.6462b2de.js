"use strict";(self.webpackChunkreact_native_testing_library_website=self.webpackChunkreact_native_testing_library_website||[]).push([[471],{7069:(t,e,i)=>{i.r(e),i.d(e,{assets:()=>o,contentTitle:()=>l,default:()=>b,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var n=i(5893),r=i(1151);const s={id:"eslint-plugin-testing-library",title:"ESLint Plugin Testing Library Compatibility"},l=void 0,a={id:"eslint-plugin-testing-library",title:"ESLint Plugin Testing Library Compatibility",description:"Most of the rules of the eslint-plugin-testing-library are compatible with this library except the following:",source:"@site/docs/EslintPLluginTestingLibrary.md",sourceDirName:".",slug:"/eslint-plugin-testing-library",permalink:"/react-native-testing-library/docs/eslint-plugin-testing-library",draft:!1,unlisted:!1,editUrl:"https://github.com/callstack/react-native-testing-library/blob/main/website/docs/EslintPLluginTestingLibrary.md",tags:[],version:"current",frontMatter:{id:"eslint-plugin-testing-library",title:"ESLint Plugin Testing Library Compatibility"},sidebar:"docs",previous:{title:"How Should I Query?",permalink:"/react-native-testing-library/docs/how-should-i-query"},next:{title:"Troubleshooting",permalink:"/react-native-testing-library/docs/troubleshooting"}},o={},c=[];function u(t){const e={a:"a",code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.a)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(e.p,{children:["Most of the rules of the ",(0,n.jsx)(e.a,{href:"https://github.com/testing-library/eslint-plugin-testing-library",children:"eslint-plugin-testing-library"})," are compatible with this library except the following:"]}),"\n",(0,n.jsxs)(e.ul,{children:["\n",(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.a,{href:"https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-user-event.md",children:"prefer-user-event"}),": ",(0,n.jsx)(e.code,{children:"userEvent"})," requires a DOM environment so it is not compatible with this library"]}),"\n"]}),"\n",(0,n.jsx)(e.p,{children:"Also, some rules have become useless, unless maybe you're using an old version of the library:"}),"\n",(0,n.jsxs)(e.ul,{children:["\n",(0,n.jsxs)(e.li,{children:["\n",(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.a,{href:"https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-wait-for.md",children:"prefer-wait-for"}),": the wait utility is no longer available"]}),"\n"]}),"\n",(0,n.jsxs)(e.li,{children:["\n",(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.a,{href:"https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-wait-for-empty-callback.md",children:"no-wait-for-empty-callback"}),": waitFor callback param is no longer optional"]}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(e.p,{children:["To get the rule ",(0,n.jsx)(e.a,{href:"https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/consistent-data-testid.md",children:"consistent-data-testid"})," to work, you need to configure it to check the testID attribute by adding the following in your eslint config file, the ",(0,n.jsx)(e.code,{children:"testIdPattern"})," being whichever pattern you want to enforce:"]}),"\n",(0,n.jsx)(e.pre,{children:(0,n.jsx)(e.code,{className:"language-javascript",children:'{\n  "testing-library/consistent-data-testid": [\n    2,\n    {\n      "testIdAttribute": ["testID"],\n      "testIdPattern": "^TestId(__[A-Z]*)?$"\n    }\n  ]\n}\n'})})]})}function b(t={}){const{wrapper:e}={...(0,r.a)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(u,{...t})}):u(t)}},1151:(t,e,i)=>{i.d(e,{Z:()=>a,a:()=>l});var n=i(7294);const r={},s=n.createContext(r);function l(t){const e=n.useContext(s);return n.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function a(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(r):t.components||r:l(t.components),n.createElement(s.Provider,{value:e},t.children)}}}]);