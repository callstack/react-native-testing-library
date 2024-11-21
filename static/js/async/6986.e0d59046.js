(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["6986"],{1985:function(e,n,r){"use strict";r.r(n);var t=r("5893"),s=r("65");function i(e){let n=Object.assign({h1:"h1",code:"code",a:"a",h3:"h3",p:"p",pre:"pre",h4:"h4"},(0,s.ah)(),e.components);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.h1,{id:"custom-render-function",children:["Custom ",(0,t.jsx)(n.code,{children:"render"})," function",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#custom-render-function",children:"#"})]}),"\n",(0,t.jsxs)(n.h3,{id:"summary",children:["Summary",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#summary",children:"#"})]}),"\n",(0,t.jsxs)(n.p,{children:["RNTL exposes the ",(0,t.jsx)(n.code,{children:"render"})," function as the primary entry point for tests. If you make complex, repeating setups for your tests, consider creating a custom render function. The idea is to encapsulate common setup steps and test wiring inside a render function suitable for your tests."]}),"\n",(0,t.jsxs)(n.h3,{id:"example",children:["Example",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#example",children:"#"})]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",meta:"title=test-utils.ts",children:"// ...\n\ninterface RenderWithProvidersProps {\n  user?: User | null;\n  theme?: Theme;\n}\n\nexport function renderWithProviders<T>(\n  ui: React.ReactElement<T>,\n  options?: RenderWithProvidersProps\n) {\n  return render(\n    <UserProvider.Provider value={options?.user ?? null}>\n      <ThemeProvider.Provider value={options?.theme ?? 'light'}>{ui}</ThemeProvider.Provider>\n    </UserProvider.Provider>\n  );\n}\n"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",meta:"title=custom-render/index.test.tsx",children:"import { screen } from '@testing-library/react-native';\nimport { renderWithProviders } from '../test-utils';\n// ...\n\ntest('renders WelcomeScreen with user', () => {\n  renderWithProviders(<WelcomeScreen />, { user: { name: 'Jar-Jar' } });\n  expect(screen.getByText(/hello Jar-Jar/i)).toBeOnTheScreen();\n});\n\ntest('renders WelcomeScreen without user', () => {\n  renderWithProviders(<WelcomeScreen />, { user: null });\n  expect(screen.getByText(/hello stranger/i)).toBeOnTheScreen();\n});\n"})}),"\n",(0,t.jsxs)(n.p,{children:["Example ",(0,t.jsx)(n.a,{href:"https://github.com/callstack/react-native-testing-library/tree/main/examples/cookbook/custom-render",target:"_blank",rel:"noopener noreferrer",children:"full source code"}),"."]}),"\n",(0,t.jsxs)(n.h3,{id:"more-info",children:["More info",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#more-info",children:"#"})]}),"\n",(0,t.jsxs)(n.h4,{id:"additional-params",children:["Additional params",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#additional-params",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"A custom render function might accept additional parameters to allow for setting up different start conditions for a test, e.g., the initial state for global state management."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",meta:"title=SomeScreen.test.tsx",children:"test('renders SomeScreen for logged in user', () => {\n  renderScreen(<SomeScreen />, { state: loggedInState });\n  // ...\n});\n"})}),"\n",(0,t.jsxs)(n.h4,{id:"multiple-functions",children:["Multiple functions",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#multiple-functions",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"Depending on the situation, you may declare more than one custom render function. For example, you have one function for testing application flows and a second for testing individual screens."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",meta:"title=test-utils.tsx",children:"function renderNavigator(ui, options);\nfunction renderScreen(ui, options);\n"})}),"\n",(0,t.jsxs)(n.h4,{id:"async-function",children:["Async function",(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#async-function",children:"#"})]}),"\n",(0,t.jsx)(n.p,{children:"Make it async if you want to put some async setup in your custom render function."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",meta:"title=SomeScreen.test.tsx",children:"test('renders SomeScreen', async () => {\n  await renderWithAsync(<SomeScreen />);\n  // ...\n});\n"})})]})}function a(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(i,{...e})}):i(e)}n.default=a,a.__RSPRESS_PAGE_META={},a.__RSPRESS_PAGE_META["12.x%2Fcookbook%2Fbasics%2Fcustom-render.md"]={toc:[{text:"Summary",id:"summary",depth:3},{text:"Example",id:"example",depth:3},{text:"More info",id:"more-info",depth:3},{text:"Additional params",id:"additional-params",depth:4},{text:"Multiple functions",id:"multiple-functions",depth:4},{text:"Async function",id:"async-function",depth:4}],title:"Custom `render` function",frontmatter:{}}}}]);