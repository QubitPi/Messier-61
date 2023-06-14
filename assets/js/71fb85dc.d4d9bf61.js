"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[480],{3905:(e,t,a)=>{a.d(t,{Zo:()=>d,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),l=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},d=function(e){var t=l(e.components);return n.createElement(i.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,d=p(e,["components","mdxType","originalType","parentName"]),c=l(a),u=r,h=c["".concat(i,".").concat(u)]||c[u]||m[u]||o;return a?n.createElement(h,s(s({ref:t},d),{},{components:a})):n.createElement(h,s({ref:t},d))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,s=new Array(o);s[0]=u;var p={};for(var i in t)hasOwnProperty.call(t,i)&&(p[i]=t[i]);p.originalType=e,p[c]="string"==typeof e?e:r,s[1]=p;for(var l=2;l<o;l++)s[l]=a[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},2050:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>i,contentTitle:()=>s,default:()=>m,frontMatter:()=>o,metadata:()=>p,toc:()=>l});var n=a(7462),r=(a(7294),a(3905));const o={sidebar_position:3,title:"GraphQL Server"},s=void 0,p={unversionedId:"development/graphql-server",id:"development/graphql-server",title:"GraphQL Server",description:"Get a knowledge graph data API throught GraphQL quickly.",source:"@site/docs/development/graphql-server.md",sourceDirName:"development",slug:"/development/graphql-server",permalink:"/Messier-61/docs/development/graphql-server",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/development/graphql-server.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,title:"GraphQL Server"},sidebar:"tutorialSidebar",previous:{title:"CI/CD",permalink:"/Messier-61/docs/development/ci-cd"}},i={},l=[{value:"Create a Data File",id:"create-a-data-file",level:3},{value:"Start the GraphQL Server",id:"start-the-graphql-server",level:3},{value:"Start Using GraphQL API",id:"start-using-graphql-api",level:3}],d={toc:l},c="wrapper";function m(e){let{components:t,...o}=e;return(0,r.kt)(c,(0,n.Z)({},d,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Get a knowledge graph data API throught GraphQL quickly."),(0,r.kt)("p",null,"Although loving to learn GraphQL, every developer and everyone who simply wants to explore Messier-61 quickly don't want\nto first read a book about GraphQL Types and Queries, then install a gazillion npm packages."),(0,r.kt)("p",null,"messier-61-graphql-server allow us to start playing with some graph data exposed via GraphQL right away. All it takes is\na JSON of our data."),(0,r.kt)("p",null,"messier-61-graphql-server is backed by ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/stealth-tech-startup/json-graphql-server"},"json-graphql-server")),(0,r.kt)("p",null,"Follow the guide below starting from scratch."),(0,r.kt)("h3",{id:"create-a-data-file"},"Create a Data File"),(0,r.kt)("p",null,"Our data file should be a standard JSON file containing an object where the keys are the entity types. The values should\nbe lists of entities, i.e. arrays of value objects with at least an ",(0,r.kt)("inlineCode",{parentName:"p"},"id")," key. For example, let's create the file named\n",(0,r.kt)("strong",{parentName:"p"},"data.json")," with the following contents:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n   "posts":[\n      {\n         "id":1,\n         "title":"Lorem Ipsum",\n         "views":254,\n         "user_id":123\n      },\n      {\n         "id":2,\n         "title":"Sic Dolor amet",\n         "views":65,\n         "user_id":456\n      }\n   ],\n   "users":[\n      {\n         "id":123,\n         "name":"John Doe"\n      },\n      {\n         "id":456,\n         "name":"Jane Doe"\n      }\n   ],\n   "comments":[\n      {\n         "id":987,\n         "post_id":1,\n         "body":"Consectetur adipiscing elit",\n         "date":"2017-07-03"\n      },\n      {\n         "id":995,\n         "post_id":1,\n         "body":"Nam molestie pellentesque dui",\n         "date":"2017-08-17"\n      }\n   ]\n}\n')),(0,r.kt)("h3",{id:"start-the-graphql-server"},"Start the GraphQL Server"),(0,r.kt)("p",null,"Navigate into messier-61-graphql-server package"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cd Messier-61/packages/messier-61-graphql-server\n")),(0,r.kt)("p",null,"and start the GraphQL server on localhost, port 3000:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm start -- <path to JSON data file>\n")),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"Note the ",(0,r.kt)("inlineCode",{parentName:"p"},"--")," separator in the command above. It is used to separate the parameters passed to ",(0,r.kt)("inlineCode",{parentName:"p"},"npm")," command itself and\nthe parameters passed to the ",(0,r.kt)("inlineCode",{parentName:"p"},"start")," script."),(0,r.kt)("p",{parentName:"admonition"},"For those who are interested, it's possible to ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/npm/npm/pull/5518"},"pass args to ",(0,r.kt)("inlineCode",{parentName:"a"},"npm run"))," since npm\n2 (2014). The syntax is as follows:"),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm run <command> [-- <args>]\n")),(0,r.kt)("p",{parentName:"admonition"},"With our ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json")," having"),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-json"},'"scripts": {\n    "start": "npx ts-node src/server.ts"\n}\n')),(0,r.kt)("p",{parentName:"admonition"},"we pass the params to those scripts:"),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm start -- ./data.json // invokes `npx ts-node src/server.ts ./data.json`\n")),(0,r.kt)("p",{parentName:"admonition"},(0,r.kt)("em",{parentName:"p"},"Note"),": ",(0,r.kt)("strong",{parentName:"p"},"If our param does not start with ",(0,r.kt)("inlineCode",{parentName:"strong"},"-")," or ",(0,r.kt)("inlineCode",{parentName:"strong"},"--"),", then having an explicit ",(0,r.kt)("inlineCode",{parentName:"strong"},"--")," separator is not needed; but it's\nbetter to do it anyway for clarity"),"."),(0,r.kt)("pre",{parentName:"admonition"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm start ./data.json // invokes `npx ts-node src/server.ts ./data.json`\n")),(0,r.kt)("p",{parentName:"admonition"},"Refernce: ",(0,r.kt)("a",{parentName:"p",href:"https://stackoverflow.com/a/14404223"},"Sending command line arguments to npm script"))),(0,r.kt)("h3",{id:"start-using-graphql-api"},"Start Using GraphQL API"),(0,r.kt)("p",null,"The server is ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/graphql/graphiql"},"GraphiQL")," enabled, so we can query our server using a full-featured graphical user interface,\nproviding autosuggest, history, etc. Just browse ",(0,r.kt)("inlineCode",{parentName:"p"},"http://localhost:3000/graphql")," to access it."),(0,r.kt)("p",null,"The following is an example of issuing the query"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"{\n  Post(id: 1) {\n    id\n    title\n    views\n    User {\n      name\n    }\n    Comments {\n      date\n      body\n    }\n  }\n}\n")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Error loading example-graphql-query.png",src:a(4331).Z,width:"3584",height:"2080"})))}m.isMDXComponent=!0},4331:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/example-graphql-query-e778d4caa0b254749010cd2ee50521c5.png"}}]);