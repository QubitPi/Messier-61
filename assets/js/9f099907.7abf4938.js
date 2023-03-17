"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[350],{3905:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>u});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),p=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},m=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},d="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),d=p(a),h=i,u=d["".concat(l,".").concat(h)]||d[h]||c[h]||r;return a?n.createElement(u,s(s({ref:t},m),{},{components:a})):n.createElement(u,s({ref:t},m))}));function u(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=a.length,s=new Array(r);s[0]=h;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o[d]="string"==typeof e?e:i,s[1]=o;for(var p=2;p<r;p++)s[p]=a[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}h.displayName="MDXCreateElement"},3521:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>c,frontMatter:()=>r,metadata:()=>o,toc:()=>p});var n=a(7462),i=(a(7294),a(3905));a(2389);const r={sidebar_position:1,title:"D3"},s=void 0,o={unversionedId:"graph/d3",id:"graph/d3",title:"D3",description:"Looking into data visualization it seems clear that the library with the greatest capability and flexibility is",source:"@site/docs/graph/d3.mdx",sourceDirName:"graph",slug:"/graph/d3",permalink:"/Messier-61/docs/graph/d3",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/graph/d3.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,title:"D3"},sidebar:"tutorialSidebar",previous:{title:"Knowledge Graph",permalink:"/Messier-61/docs/category/knowledge-graph"},next:{title:"Development",permalink:"/Messier-61/docs/category/development"}},l={},p=[{value:"Compatibility with React",id:"compatibility-with-react",level:2},{value:"Configurable D3 Graph",id:"configurable-d3-graph",level:2},{value:"Generating Force Graph Simulation",id:"generating-force-graph-simulation",level:3},{value:"Grouping Nodes and Links for Batch Operations",id:"grouping-nodes-and-links-for-batch-operations",level:3},{value:"Defining the Graph Re-Drawing",id:"defining-the-graph-re-drawing",level:3},{value:"Understanding enter() and exit()",id:"understanding-enter-and-exit",level:4},{value:"Understanding <code>linesg.selectAll(&quot;line.link&quot;)</code>",id:"understanding-linesgselectalllinelink",level:4},{value:"Defining Behavior",id:"defining-behavior",level:3},{value:"Reference",id:"reference",level:2}],m={toc:p},d="wrapper";function c(e){let{components:t,...r}=e;return(0,i.kt)(d,(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Looking into data visualization it seems clear that the library with the greatest capability and flexibility is\n",(0,i.kt)("a",{parentName:"p",href:"https://d3js.org/"},"D3"),', which has over a thousand methods. It goes down to such base components that it does not even consider itself\nto be a data visualization library, but instead provides "efficient manipulation of documents based on data". Basically\nit binds data to DOM objects and gives us lots of ways to manipulate them, which is used by a lot of people to\nmanipulate SVG graphics, and thus data visualization. It appears to have a bit of a learning curve but we are up for it.\nI would rather learn something new than get bottle-necked later using a prebuilt library.'),(0,i.kt)("h2",{id:"compatibility-with-react"},"Compatibility with React"),(0,i.kt)("p",null,"There is a fundamental compatibility issue between React and D3. Because React creates a\n",(0,i.kt)("a",{parentName:"p",href:"https://reactjs.org/docs/faq-internals.html"},"Virtual DOM"),", and D3 works by creating and manipulating objects in the actual DOM, we have to find a way\nto get D3 working inside the Virtual DOM. This problem has been solved a number of different ways"),(0,i.kt)("p",null,"We would think that there would just be a package that would handle this. There is a package called\n",(0,i.kt)("a",{parentName:"p",href:"https://github.com/react-d3-library/react-d3-library"},"react-d3-library")," that purported to let us use stock D3 code in React with just a few adjustments.\nHowever this package is no longer maintained and the last commit was 4 years ago. So this does not seem like the route\nto go down."),(0,i.kt)("p",null,"Here are some of the other methods that people have written about."),(0,i.kt)("p",null,"Amelia Wattenberger has written an excellent article ",(0,i.kt)("a",{parentName:"p",href:"https://wattenberger.com/blog/react-and-d3"},"React + D3")," where she basically advocates that we\nshouldn't be using the D3 methods that render the SVG graphics, but to render them all manually using JSX and only use\nD3 methods that do math like calculating scale. On the one hand she may have a point here, but on the other hand she is\nbasically throwing away the majority of the D3 methods and recreating them which is a huge duplication of effort. It's\nalmost as if her answer to the question of how to use D3 with React is \"You don't\"."),(0,i.kt)("p",null,"The other sources that I have found seem to be on more of a similar page. They advocate a combination of ",(0,i.kt)("inlineCode",{parentName:"p"},"useRef")," to\ndirect D3 to an SVG and ",(0,i.kt)("inlineCode",{parentName:"p"},"useEffect")," to manipulate it."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://blog.griddynamics.com/using-d3-js-with-react-js-an-8-step-comprehensive-manual/"},"griddynamics: Using D3.js with React.js: An 8-step comprehensive manual")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app"},"Pluralsight: Using D3.js Inside a React App")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://blog.logrocket.com/using-d3-js-v6-with-react/"},"LogRocket: Using D3.js v6 with React"))),(0,i.kt)("h2",{id:"configurable-d3-graph"},"Configurable D3 Graph"),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("h3",{parentName:"admonition",id:"d3-with-react-hooks"},"D3 with React Hooks"),(0,i.kt)("p",{parentName:"admonition"},(0,i.kt)("strong",{parentName:"p"},"React Function Components")," with Hooks gives us a nice way to integrate D3 with React. There are many related articles\nthat describe this already but they get in the weeds and complicated quickly. This discussion is just the basics on\nwhere to put things to get started correctly. We can expand from there."),(0,i.kt)("p",{parentName:"admonition"},"In the past it was confusing to find the correct places to put D3 code, especially for someone new to D3 still getting\ntheir head wrapped around D3's way of doing things. Optimization to minimize re-rendering was an advanced task when it\nshould be easy."),(0,i.kt)("p",{parentName:"admonition"},"Function Components with Hooks cleans this up quite a bit. There is one place to put D3, one way to connect it to\nReact's DOM, and re-render logic is mostly built in."),(0,i.kt)("h3",{parentName:"admonition",id:"useref-hook"},"useRef Hook"),(0,i.kt)("p",{parentName:"admonition"},"We're building a function not a class. There are no class member variables so we need a way to hold onto an object\nacross multiple rendering passes."),(0,i.kt)("p",{parentName:"admonition"},(0,i.kt)("strong",{parentName:"p"},"useRef()")," creates a variable that does just that. The variable acts a lot like a class member variable without the\nclass. We utilize ",(0,i.kt)("inlineCode",{parentName:"p"},"useRef()"),' to hold onto the DOM element containing our D3 content. A ref is "get" and "set" via its\n',(0,i.kt)("inlineCode",{parentName:"p"},".current")," property."),(0,i.kt)("h3",{parentName:"admonition",id:"useeffect-hook"},"useEffect Hook"),(0,i.kt)("p",{parentName:"admonition"},(0,i.kt)("strong",{parentName:"p"},"useEffect()")," gives us a place to put side effects such as our D3 code. It's a side effect because it adds content to\nthe DOM outside of React's virtual DOM mechanism."),(0,i.kt)("admonition",{parentName:"admonition",type:"info"},(0,i.kt)("p",{parentName:"admonition"},(0,i.kt)("inlineCode",{parentName:"p"},"useEffect()")," is like ",(0,i.kt)("inlineCode",{parentName:"p"},"componentDidMount()")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"componentWillReceiveProps()")," combined, with change detection as a\nfirst-class feature."))),(0,i.kt)("p",null,"Here is the part of code that reflects the usage of ",(0,i.kt)("inlineCode",{parentName:"p"},"useRef")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"useEffect")," as well as how Messier-61 components\nhandles drawing knowledge graph in D3"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},'import React, { useEffect, useRef } from "react";\nimport * as d3 from "d3";\nimport styles from "./D3Graph.module.css";\nimport type { Node, Link, GraphConfig } from "../GraphConfig";\n\nexport function D3Graph(graphConfig: GraphConfig): JSX.Element {\n  const svgRef = useRef(null);\n\n  const width = graphConfig.canvasConfig.width;\n  const height = graphConfig.canvasConfig.height;\n\n  const nodes: any[] = initializeNodes(graphConfig.graphData.nodes);\n  let links: any[] = initializeLinks(graphConfig.graphData.links);\n\n  useEffect(() => {\n    ... // graph rendering and listener logics\n  }, [nodes, links, svgRef.current]);\n\n  const stylesName = [styles.g, styles.node, styles.line, styles.link, styles.newLine];\n  return <svg ref={svgRef} width={width} height={height} className={stylesName.join(" ")}></>;\n}\n\n')),(0,i.kt)("p",null,"Here is what the code above is doing:"),(0,i.kt)("p",null,"Call ",(0,i.kt)("inlineCode",{parentName:"p"},"useRef()")," to create a variable (",(0,i.kt)("inlineCode",{parentName:"p"},"svgRef"),") to hold the SVG element. Initialize it as ",(0,i.kt)("inlineCode",{parentName:"p"},"null"),". React will set it the\nfirst time the page is rendered."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("mdxAdmonitionTitle",{parentName:"admonition"},"Why not just use ",(0,i.kt)("inlineCode",{parentName:"mdxAdmonitionTitle"},"d3.select()")," to get the SVG element, or insert the SVG element using pure D3?"),(0,i.kt)("p",{parentName:"admonition"},"By using a ref variable we can use it as a ",(0,i.kt)("strong",{parentName:"p"},"dependency")," in our ",(0,i.kt)("inlineCode",{parentName:"p"},"useEffect()")," block to detect when the element has\nactually been rendered and available.")),(0,i.kt)("p",null,"Call ",(0,i.kt)("inlineCode",{parentName:"p"},"useEffect()")," to execute our D3 code which draws graph on canvas. ",(0,i.kt)("inlineCode",{parentName:"p"},"useEffect()")," takes two arguments"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"a function to run, and"),(0,i.kt)("li",{parentName:"ol"},"an array of dependency variables")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"useEffect()")," will run every time one of the dependency variables changes. Because we listed graph ",(0,i.kt)("inlineCode",{parentName:"p"},"nodes")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"links"),"\nas dependencies, ",(0,i.kt)("inlineCode",{parentName:"p"},"useEffect()")," will run again whenever graph data changes. We don't need to write code to compare old\nand new data for changes anymore!"),(0,i.kt)("p",null,"The Function Component returns an SVG element, and its ref attribute is set to ",(0,i.kt)("inlineCode",{parentName:"p"},"svgRef")," - the ref variable we declared\nat the top of the function."),(0,i.kt)("p",null,"React will run our D3 code when the DOM is ready and when the data changes."),(0,i.kt)("h3",{id:"generating-force-graph-simulation"},"Generating Force Graph Simulation"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Due to changes in namespace from v3 to v4"),". The force layout ",(0,i.kt)("inlineCode",{parentName:"p"},"d3.layout.force")," has been\n",(0,i.kt)("a",{parentName:"p",href:"https://github.com/d3/d3/blob/master/CHANGES.md#forces-d3-force"},"renamed")," to ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/d3/d3-force"},(0,i.kt)("inlineCode",{parentName:"a"},"d3.forceSimulation")),(0,i.kt)("sup",{parentName:"p",id:"fnref-1"},(0,i.kt)("a",{parentName:"sup",href:"#fn-1",className:"footnote-ref"},"1")),". ",(0,i.kt)("em",{parentName:"p"},"It\nis, therefore, strongly recommended to read ",(0,i.kt)("a",{parentName:"em",href:"https://github.com/d3/d3-force"},(0,i.kt)("inlineCode",{parentName:"a"},"d3.forceSimulation")," documentation")," thoroughly in order to\nunderstand what the following discussion is talking about"),". After that, we will discuss how the code snipped can be\nchanged to the following v4+ version:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'function initializeSimulation(nodes: any[], links: any[], width: number, height: number): any {\n  return d3\n    .forceSimulation(nodes)\n    .force("charge", d3.forceManyBody().strength(DEFAULT_FORCE_STRENGTH))\n    .force(\n      "link",\n      d3\n        .forceLink()\n        .distance(DEFAULT_LINK_DISTANCE)\n        .id(function (d: any) {\n          return d.id;\n        })\n        .links(links)\n    )\n    .force("center", d3.forceCenter(width / 2, height / 2));\n}\n')),(0,i.kt)("p",null,"The method above creates a new simulation with the specified array of nodes and forces. If nodes is not specified, it\ndefaults to the empty array. The simulator starts automatically."),(0,i.kt)("p",null,"Each node must be an ",(0,i.kt)("em",{parentName:"p"},"object"),". The following properties are assigned by the simulation:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"index")," - the node's zero-based index"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"x")," - the node's current x-position"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"y")," - the node's current y-position"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"vx")," - the node's current x-velocity"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"vy")," - the node's current y-velocity")),(0,i.kt)("p",null,"The position ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("mi",{parentName:"mrow"},"x"),(0,i.kt)("mo",{parentName:"mrow",separator:"true"},","),(0,i.kt)("mi",{parentName:"mrow"},"y"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"(x, y)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"x"),(0,i.kt)("span",{parentName:"span",className:"mpunct"},","),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.1667em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"y"),(0,i.kt)("span",{parentName:"span",className:"mclose"},")")))))," and velocity ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"v"),(0,i.kt)("mi",{parentName:"msub"},"x")),(0,i.kt)("mo",{parentName:"mrow",separator:"true"},","),(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"v"),(0,i.kt)("mi",{parentName:"msub"},"y")),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"(v_x, v_y)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0361em",verticalAlign:"-0.2861em"}}),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"v"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.1514em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.55em",marginLeft:"-0.0359em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"x")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,i.kt)("span",{parentName:"span"})))))),(0,i.kt)("span",{parentName:"span",className:"mpunct"},","),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.1667em"}}),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"v"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.1514em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.55em",marginLeft:"-0.0359em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal mtight",style:{marginRight:"0.03588em"}},"y")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.2861em"}},(0,i.kt)("span",{parentName:"span"})))))),(0,i.kt)("span",{parentName:"span",className:"mclose"},")")))))," may be subsequently modified by ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/d3/d3-force#simulation_force"},"forces")," and by the simulation.\nIf either ",(0,i.kt)("inlineCode",{parentName:"p"},"vx")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"vy")," is ",(0,i.kt)("inlineCode",{parentName:"p"},"NaN"),", the velocity is initialized to ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("mn",{parentName:"mrow"},"0"),(0,i.kt)("mo",{parentName:"mrow",separator:"true"},","),(0,i.kt)("mn",{parentName:"mrow"},"0"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"(0, 0)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord"},"0"),(0,i.kt)("span",{parentName:"span",className:"mpunct"},","),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.1667em"}}),(0,i.kt)("span",{parentName:"span",className:"mord"},"0"),(0,i.kt)("span",{parentName:"span",className:"mclose"},")"))))),". If either ",(0,i.kt)("inlineCode",{parentName:"p"},"x")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"y")," is ",(0,i.kt)("inlineCode",{parentName:"p"},"NaN"),", the position is\ninitialized in a ",(0,i.kt)("a",{parentName:"p",href:"https://observablehq.com/@d3/force-layout-phyllotaxis"},"phyllotaxis arrangement")," (shown below), so chosen to ensure a deterministic,\nuniform distribution."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Error loading phyllotaxis-arrangement.png",src:a(4418).Z,width:"1298",height:"1126"})),(0,i.kt)("p",null,"To fix a node in a given position, we may specify two additional properties:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"fx")," - the node's fixed x-position"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"fy")," - the node's fixed y-position")),(0,i.kt)("p",null,"At the end of each tick (explained below), after the application of any forces, a node with a defined ",(0,i.kt)("em",{parentName:"p"},"node"),".fx has\n",(0,i.kt)("em",{parentName:"p"},"node"),".x reset to this value and ",(0,i.kt)("em",{parentName:"p"},"node"),".vx set to zero; likewise, a node with a defined ",(0,i.kt)("em",{parentName:"p"},"node"),".fy has ",(0,i.kt)("em",{parentName:"p"},"node"),".y reset to\nthis value and ",(0,i.kt)("em",{parentName:"p"},"node"),".vy set to zero. To unfix a node that was previously fixed, set ",(0,i.kt)("em",{parentName:"p"},"node"),".fx and ",(0,i.kt)("em",{parentName:"p"},"node"),".fy to null, or\ndelete these properties."),(0,i.kt)("p",null,"If the specified array of ",(0,i.kt)("em",{parentName:"p"},"nodes")," is modified, such as when nodes are added to or removed from the simulation, this\nmethod must be called again with the new (or changed) array to notify the simulation and bound forces of the change; the\nsimulation does not make a defensive copy of the specified array."),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("mdxAdmonitionTitle",{parentName:"admonition"},(0,i.kt)("inlineCode",{parentName:"mdxAdmonitionTitle"},"simulation.tick([iterations])")),(0,i.kt)("p",{parentName:"admonition"},"Manually steps the simulation by the specified number of ",(0,i.kt)("em",{parentName:"p"},"iterations"),", and returns the simulation. If ",(0,i.kt)("em",{parentName:"p"},"iterations")," is\nnot specified, it defaults to 1 (single step).")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"charge")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"link")," have been changed to its new API versions which are\n",(0,i.kt)("a",{parentName:"p",href:"https://www.d3indepth.com/force-layout/#forcemanybody"},"forceManyBody")," and\n",(0,i.kt)("a",{parentName:"p",href:"https://www.d3indepth.com/force-layout/#forcelink"},"forceLink"),", respectively."),(0,i.kt)("p",null,'The only effect that the old force layout.size had was to set the attraction point for the "gravity" force to be\n',"[width / 2, height / 2]",". This has been replaced by the positioning forces ",(0,i.kt)("strong",{parentName:"p"},"d3.forceX")," and ",(0,i.kt)("strong",{parentName:"p"},"d3.forceY"),(0,i.kt)("sup",{parentName:"p",id:"fnref-2"},(0,i.kt)("a",{parentName:"sup",href:"#fn-2",className:"footnote-ref"},"2"))),(0,i.kt)("p",null,"We are done with the graph setup. Next we will define its behavior"),(0,i.kt)("h3",{id:"grouping-nodes-and-links-for-batch-operations"},"Grouping Nodes and Links for Batch Operations"),(0,i.kt)("p",null,"We prepare this grouping so that we can apply certain operations on each node/link, such as re-loading every existing\nnode onto canvas during a graph redraw."),(0,i.kt)("p",null,"We achieve that using the following lines of codes:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'const linesg = svg.append("g");\nconst circlesg = svg.append("g");\n')),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"<g>")," SVG element is a container used to group other SVG elements, i.e. nodes and links. D3 operations applied to\nthe ",(0,i.kt)("inlineCode",{parentName:"p"},"<g>")," element are performed on its child elements of links and nodes, and its attributes are inherited by its\nchildren. See ",(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g"},"MDN Web Docs")," for more details.javascript"),(0,i.kt)("h3",{id:"defining-the-graph-re-drawing"},"Defining the Graph Re-Drawing"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'const link = linesg\n  .selectAll("line.link")\n  .data(links)\n  .attr("x1", function (d: any) {\n    return d.source.x;\n  })\n  .attr("y1", function (d: any) {\n    return d.source.y;\n  })\n  .attr("x2", function (d: any) {\n    return d.target.x;\n  })\n  .attr("y2", function (d: any) {\n    return d.target.y;\n  })\n  .classed("selected", function (d: any) {\n    return d === selectedLink;\n  });\n\n// load all existing links\nlink.enter().append("line").attr("class", "link").attr("marker-end", "url(#child)").on("mousedown", linkMousedown);\n\n// off-load obsolete links due to node removal\nlink.exit().remove();\n')),(0,i.kt)("p",null,"Almost everyone learning about D3 is confused about the ",(0,i.kt)("inlineCode",{parentName:"p"},"selectAll")," above: ",(0,i.kt)("inlineCode",{parentName:"p"},'const link = linesg.selectAll("line.link")'),".\nWhy can we select things that don't exist yet? In order to fully comprehend that, we need to first discuss ",(0,i.kt)("strong",{parentName:"p"},"enter()"),"\nand ",(0,i.kt)("strong",{parentName:"p"},"exit")),(0,i.kt)("h4",{id:"understanding-enter-and-exit"},"Understanding enter() and exit()"),(0,i.kt)("p",null,"Let's consider yet another example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<body>\n  <div>\n    <p class="x"></p>\n  </div>\n  <script>\n    d3.select("div")\n      .selectAll("p")\n      .data([3, 4])\n      /**\n       * if I uncomment this it works\n       * but I don\'t want to call the\n       * same function twice\n       */\n      // .text(d => d + \'\')\n      .enter()\n      .append("p")\n      .text((d) => d + "");\n  <\/script>\n</body>\n')),(0,i.kt)("p",null,"When we do this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'d3.select("div").selectAll("p");\n')),(0,i.kt)("p",null,"We're selecting all ",(0,i.kt)("inlineCode",{parentName:"p"},"<p>")," elements inside the selected ",(0,i.kt)("inlineCode",{parentName:"p"},"div"),". We have only one div (that doesn't matter, because\n",(0,i.kt)("inlineCode",{parentName:"p"},"select")," selects the first one it gets anyway...) and only one ",(0,i.kt)("inlineCode",{parentName:"p"},"<p>")," element inside it."),(0,i.kt)("p",null,"Then, we bind the data:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},".data([3, 4])\n")),(0,i.kt)("p",null,"Thus, so far, we have:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"1 element in the selection"),(0,i.kt)("li",{parentName:"ul"},"2 data points in the data")),(0,i.kt)("p",null,'Now comes the important part regarding the "enter" selection: we already have one ',(0,i.kt)("inlineCode",{parentName:"p"},"<p>")," element in our selection. That\n",(0,i.kt)("inlineCode",{parentName:"p"},"<p>")," element gets the first datum, ",(0,i.kt)("inlineCode",{parentName:"p"},"3"),". The remaining datum is appended to a newly created ",(0,i.kt)("inlineCode",{parentName:"p"},"p")," element, which is ",(0,i.kt)("inlineCode",{parentName:"p"},"4"),"."),(0,i.kt)("p",null,'Our "enter" selection contains all data points without a corresponding element. As we can see, since we have 1 element\nin the selection and 2 data points, your "enter" selection has only 1 element. Let\'s show it:'),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Error loading enter-example-1.png",src:a(501).Z,width:"1346",height:"1194"})),(0,i.kt)("p",null,'In a nutshell, we have to compare the selection with the data: if we have more data than elements, the extra data will\nbe bound to elements belonging to the "enter" selection. If we have more elements than data, the extra elements without\ncorresponding data belong to the "exit" selection. In our case, the "exit" selection is empty.'),(0,i.kt)("p",null,"Finally, if we want to update the text of our existing ",(0,i.kt)("inlineCode",{parentName:"p"},"<p>"),' element, we have to use an "update" selection. It can be a\nbit more verbose, like this:'),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Error loading enter-example-2.png",src:a(631).Z,width:"1346",height:"1210"})),(0,i.kt)("p",null,"Or we can merge the enter selection and the update one, in a slightly smaller code:"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Error loading enter-example-3.png",src:a(433).Z,width:"1348",height:"1182"})),(0,i.kt)("p",null,"In both examples the update selection is named ",(0,i.kt)("inlineCode",{parentName:"p"},"p"),"."),(0,i.kt)("h4",{id:"understanding-linesgselectalllinelink"},"Understanding ",(0,i.kt)("inlineCode",{parentName:"h4"},'linesg.selectAll("line.link")')),(0,i.kt)("p",null,"Always keep in mind, that D3 is all about ",(0,i.kt)("em",{parentName:"p"},"binding data to some DOM structure and providing the means of keeping the\ndata and the document in sync"),"."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Select all ",(0,i.kt)("inlineCode",{parentName:"p"},"line")," elements having class ",(0,i.kt)("inlineCode",{parentName:"p"},"link")," . This may very well return an empty selection when we have no graph\nlinks on canvas, but it will still be a d3.selection.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Bind data to this selection. Based on the above mentioned selection this will, on a per-element basis, compute a join\nchecking if the new data is"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"not yet bound to this selection, or"),(0,i.kt)("li",{parentName:"ul"},"has been bound before, or"),(0,i.kt)("li",{parentName:"ul"},"was bound before but is not included in the new data any more.")),(0,i.kt)("p",{parentName:"li"},"Depending on the result of this check the selection will be divided into an ",(0,i.kt)("strong",{parentName:"p"},"enter"),", an ",(0,i.kt)("strong",{parentName:"p"},"update"),", or an ",(0,i.kt)("strong",{parentName:"p"},"exit"),"\nselection, respectively.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Because our selection was empty in the first place. All data will end up in the ",(0,i.kt)("strong",{parentName:"p"},"enter")," selection and nothing\nhappens in the following executions"),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},'.attr("x1", function (d: any) { return d.source.x; })\n.attr("y1", function (d: any) { return d.source.y; })\n.attr("x2", function (d: any) { return d.target.x; })\n.attr("y2", function (d: any) { return d.target.y; })\n.classed("selected", function (d: any) { return d === selectedLink; })\n'))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"The ",(0,i.kt)("strong",{parentName:"p"},"enter")," selection is then retrieved by calling ",(0,i.kt)("inlineCode",{parentName:"p"},"selection.enter()")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"link.enter()"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"We append the new ",(0,i.kt)("inlineCode",{parentName:"p"},"line")," elements corresponding to the newly bound data by calling ",(0,i.kt)("inlineCode",{parentName:"p"},'selection.append("line")')," on the\nenter selection."))),(0,i.kt)("h3",{id:"defining-behavior"},"Defining Behavior"),(0,i.kt)("p",null,"The remaining defines the behavior:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event"},"Element: mousedown event")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"linkMousedown")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"nodeMousedown")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"mousedown")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event"},"Element: mouseout event")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"nodeMouseout")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event"},"Element: mouseover event")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"nodeMouseover")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event"},"Element: keydown event")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"windowKeydown")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event"},"Element: mousemove event")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"windowMousemove")))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event"},"Element: mouseup event")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},"windowMouseup"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"Note that is we would like to implement the behavior of not drawing the link when either of the link endpoints\ncontains a node, we would have something like the following:"),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"if (selectedSourceNode != null && selectedTargetNode != null) {\n  links.push({ source: selectedSourceNode, target: d });\n  update();\n} else {\n  newLine.remove();\n  newLine = null;\n}\n")),(0,i.kt)("p",{parentName:"li"},"The ",(0,i.kt)("inlineCode",{parentName:"p"},"newLine = null")," makes sure the same behavior can repeat."))))),(0,i.kt)("h2",{id:"reference"},"Reference"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://ncoughlin.com/posts/d3-react/"},"D3 with React")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://medium.com/@jeffbutsch/using-d3-in-react-with-hooks-4a6c61f1d102"},"Simple D3 with React Hooks")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://stackoverflow.com/a/43357028"},"Understanding enter() and exit()")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://stackoverflow.com/a/33401494"},"Basic d3: why can you select things that don't exist yet?"))),(0,i.kt)("div",{className:"footnotes"},(0,i.kt)("hr",{parentName:"div"}),(0,i.kt)("ol",{parentName:"div"},(0,i.kt)("li",{parentName:"ol",id:"fn-1"},(0,i.kt)("a",{parentName:"li",href:"https://stackoverflow.com/questions/49441793/d3-difference-between-layout-force-forcesimulation-to-build-network-graph#comment85885511_49441793"},"https://stackoverflow.com/questions/49441793/d3-difference-between-layout-force-forcesimulation-to-build-network-graph#comment85885511_49441793"),(0,i.kt)("a",{parentName:"li",href:"#fnref-1",className:"footnote-backref"},"\u21a9")),(0,i.kt)("li",{parentName:"ol",id:"fn-2"},(0,i.kt)("a",{parentName:"li",href:"https://stackoverflow.com/a/62563459"},"https://stackoverflow.com/a/62563459"),(0,i.kt)("a",{parentName:"li",href:"#fnref-2",className:"footnote-backref"},"\u21a9")))))}c.isMDXComponent=!0},501:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/enter-example-1-8cdc73943cf800b0baf2f82dd416fcc2.png"},631:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/enter-example-2-03e58508c568ebd35fee6627a7b4f694.png"},433:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/enter-example-3-fb9a8d40a35c0de2cc992f9f90042718.png"},4418:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/phyllotaxis-arrangement-d215fab72d3a627a018434e52a692292.png"}}]);