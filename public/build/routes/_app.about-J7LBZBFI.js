import{a as q}from"/build/_shared/chunk-OWHGGQXZ.js";import{A as N,B as w,O as k,Q as L,R as u,T as E,W as v,Y as A,a as j,d as y,o as g,z as x}from"/build/_shared/chunk-HSN27K43.js";import{a as I,g as p,l as h,q as b}from"/build/_shared/chunk-WXLKSXYU.js";import{c as d}from"/build/_shared/chunk-Q3IECNXJ.js";var S=d(j(),1);var T=d(q(),1);var f=d(I(),1),e=d(b(),1);function z(){(0,f.useEffect)(()=>{let c=t=>{let s=t.target;if(s.tagName==="A"&&s.getAttribute("href")?.startsWith("#")){t.preventDefault();let i=s.getAttribute("href")?.substring(1),a=document.getElementById(i||"");if(document.querySelectorAll(".nav-item").forEach(r=>r.classList.remove("active")),s.classList.add("active"),a){let r=a.offsetTop-80;a.classList.add("pulse-highlight"),setTimeout(()=>a.classList.remove("pulse-highlight"),1e3),window.scrollTo({top:r,behavior:"smooth"})}}};document.addEventListener("click",c);let m=()=>{let t=window.scrollY,s=document.querySelectorAll("section[id]"),i=document.querySelectorAll(".nav-item");s.forEach(a=>{let n=a.offsetTop-150,r=n+a.offsetHeight,l=a.getAttribute("id")||"";t>=n&&t<r&&i.forEach(o=>{o.classList.remove("active"),o.getAttribute("href")===`#${l}`&&o.classList.add("active")})})};return window.addEventListener("scroll",m),()=>{document.removeEventListener("click",c),window.removeEventListener("scroll",m)}},[])}function C(){let{user:c}=h();return z(),(0,f.useEffect)(()=>{let t=new IntersectionObserver(a=>{a.forEach(n=>{n.isIntersecting&&(n.target.classList.add("animate-fade-in"),n.target.querySelectorAll(".animate-child").forEach((l,o)=>{setTimeout(()=>{l.classList.add("animate-fade-in")},100*(o+1))}))})},{threshold:.15,rootMargin:"0px 0px -10% 0px"}),s=document.querySelectorAll(".scroll-fade");s.forEach(a=>{t.observe(a)});let i=()=>{let a=window.scrollY;document.querySelectorAll(".parallax").forEach(r=>{let l=r.getAttribute("data-speed")||"0.1",o=a*parseFloat(l);r.setAttribute("style",`transform: translateY(${o}px)`)})};return window.addEventListener("scroll",i),()=>{s.forEach(a=>{t.unobserve(a)}),window.removeEventListener("scroll",i)}},[]),(0,e.jsxs)("div",{className:"min-h-screen bg-white",children:[(0,e.jsx)("nav",{className:"hidden md:block fixed right-10 top-1/2 transform -translate-y-1/2 z-50",children:(0,e.jsx)("div",{className:"bg-white/70 backdrop-blur-md rounded-full py-6 px-3 shadow-xl border border-green-100 transition-all duration-500 hover:bg-white/90 hover:border-green-200",children:(0,e.jsxs)("ul",{className:"flex flex-col items-center space-y-8",children:[(0,e.jsx)("li",{children:(0,e.jsxs)("a",{href:"#vision",className:"nav-item p-3 text-green-700 hover:text-green-500 transition-all duration-300 relative group",title:"Visi\xF3n",children:[(0,e.jsx)(u,{className:"w-5 h-5 transition-transform group-hover:scale-110"}),(0,e.jsx)("span",{className:"absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-lg text-sm text-green-800 whitespace-nowrap",children:"Visi\xF3n"}),(0,e.jsx)("span",{className:"absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"})]})}),(0,e.jsx)("li",{children:(0,e.jsxs)("a",{href:"#mision",className:"nav-item p-3 text-green-700 hover:text-green-500 transition-all duration-300 relative group",title:"Misi\xF3n",children:[(0,e.jsx)(v,{className:"w-5 h-5 transition-transform group-hover:scale-110"}),(0,e.jsx)("span",{className:"absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-lg text-sm text-green-800 whitespace-nowrap",children:"Misi\xF3n"}),(0,e.jsx)("span",{className:"absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"})]})}),(0,e.jsx)("li",{children:(0,e.jsxs)("a",{href:"#valores",className:"nav-item p-3 text-green-700 hover:text-green-500 transition-all duration-300 relative group",title:"Valores",children:[(0,e.jsx)(x,{className:"w-5 h-5 transition-transform group-hover:scale-110"}),(0,e.jsx)("span",{className:"absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-lg text-sm text-green-800 whitespace-nowrap",children:"Valores"}),(0,e.jsx)("span",{className:"absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"})]})}),(0,e.jsx)("li",{children:(0,e.jsxs)("a",{href:"#contacto",className:"nav-item p-3 text-green-700 hover:text-green-500 transition-all duration-300 relative group",title:"Contacto",children:[(0,e.jsx)(g,{className:"w-5 h-5 transition-transform group-hover:scale-110"}),(0,e.jsx)("span",{className:"absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-lg text-sm text-green-800 whitespace-nowrap",children:"Contacto"}),(0,e.jsx)("span",{className:"absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"})]})})]})})}),(0,e.jsxs)("section",{className:"relative overflow-hidden",children:[(0,e.jsx)("div",{className:"absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-50 via-white to-transparent z-0"}),(0,e.jsx)("div",{className:"absolute -bottom-32 -left-32 w-64 h-64 bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"}),(0,e.jsx)("div",{className:"absolute -bottom-8 left-20 w-72 h-72 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"}),(0,e.jsx)("div",{className:"absolute top-8 -right-4 w-72 h-72 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"}),(0,e.jsx)("div",{className:"relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40",children:(0,e.jsxs)("div",{className:"text-center space-y-10",children:[(0,e.jsxs)("div",{className:"space-y-5",children:[(0,e.jsx)("div",{className:"inline-block animate-fade-in",children:(0,e.jsx)("span",{className:"text-sm font-medium text-green-600 tracking-widest uppercase px-4 py-1.5 bg-green-50 rounded-full",children:"Conoce Nuestra Historia"})}),(0,e.jsxs)("h1",{className:"text-6xl sm:text-8xl font-extralight text-gray-900 tracking-tight leading-none animate-fade-in animation-delay-300",children:["CLIQUEALO",(0,e.jsxs)("div",{className:"flex items-center justify-center",children:[(0,e.jsx)("div",{className:"h-px w-8 bg-gradient-to-r from-transparent via-green-300 to-transparent mx-3"}),(0,e.jsx)("span",{className:"block text-xl sm:text-2xl font-normal text-green-700 mt-2 tracking-widest",children:"DE M\xC9XICO"}),(0,e.jsx)("div",{className:"h-px w-8 bg-gradient-to-r from-transparent via-green-300 to-transparent mx-3"})]})]}),(0,e.jsx)("p",{className:"text-xl sm:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed italic animate-fade-in animation-delay-500",children:'"Creando no solo una marca, sino un estilo de vida."'})]}),(0,e.jsxs)("div",{className:"flex items-center justify-center space-x-8 pt-8 animate-fade-in animation-delay-700",children:[(0,e.jsx)("div",{className:"w-20 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"}),(0,e.jsx)(N,{className:"w-8 h-8 text-green-500"}),(0,e.jsx)("div",{className:"w-20 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"})]}),(0,e.jsx)("div",{className:"animate-bounce animation-delay-1000 mt-10",children:(0,e.jsx)("a",{href:"#vision",className:"inline-block",children:(0,e.jsx)("div",{className:"w-10 h-10 mx-auto border border-green-200 rounded-full flex items-center justify-center",children:(0,e.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 text-green-500",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,e.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 14l-7 7m0 0l-7-7m7 7V3"})})})})})]})})]}),(0,e.jsx)("section",{id:"vision",className:"py-32 bg-white scroll-fade opacity-0",children:(0,e.jsx)("div",{className:"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,e.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",children:[(0,e.jsxs)("div",{className:"space-y-8",children:[(0,e.jsxs)("div",{className:"space-y-4",children:[(0,e.jsxs)("div",{className:"inline-flex items-center px-4 py-2 bg-green-50 rounded-full",children:[(0,e.jsx)(u,{className:"w-5 h-5 text-green-600 mr-2"}),(0,e.jsx)("span",{className:"text-sm font-medium text-green-600 tracking-widest uppercase",children:"Nuestra Visi\xF3n"})]}),(0,e.jsxs)("h2",{className:"text-4xl sm:text-5xl font-light text-gray-900 leading-tight",children:["Transformando",(0,e.jsx)("span",{className:"block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500",children:"experiencias"})]})]}),(0,e.jsx)("p",{className:"text-lg text-gray-600 leading-relaxed",children:"Ser una marca mexicana referente en innovaci\xF3n y confianza, que transforma la experiencia de compra-venta de autos, el desarrollo tecnol\xF3gico y la creaci\xF3n de contenido, conectando a las personas con soluciones digitales, seguras y creativas."}),(0,e.jsx)("div",{className:"pt-6",children:(0,e.jsxs)("a",{href:"#mision",className:"inline-flex items-center px-6 py-3 border border-green-100 text-green-700 bg-green-50 hover:bg-green-100 transition-colors rounded-full text-sm font-medium",children:[(0,e.jsx)("span",{children:"Conoce nuestra misi\xF3n"}),(0,e.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 ml-2",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,e.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]})})]}),(0,e.jsxs)("div",{className:"relative",children:[(0,e.jsx)("div",{className:"absolute top-0 right-0 -mt-10 -mr-10",children:(0,e.jsx)("div",{className:"w-20 h-20 bg-amber-50 rounded-full opacity-70"})}),(0,e.jsx)("div",{className:"absolute bottom-0 left-0 -mb-10 -ml-10",children:(0,e.jsx)("div",{className:"w-24 h-24 bg-teal-50 rounded-full opacity-70"})}),(0,e.jsx)("div",{className:"aspect-square bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 flex items-center justify-center shadow-lg relative z-10",children:(0,e.jsxs)("div",{className:"text-center space-y-6",children:[(0,e.jsx)("div",{className:"w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mx-auto flex items-center justify-center transform hover:rotate-12 transition-transform duration-500",children:(0,e.jsx)(L,{className:"w-12 h-12 text-white"})}),(0,e.jsxs)("div",{className:"space-y-2",children:[(0,e.jsx)("h3",{className:"text-2xl font-medium text-gray-900",children:"Innovaci\xF3n"}),(0,e.jsx)("p",{className:"text-gray-600",children:"L\xEDder en transformaci\xF3n digital"})]})]})})]})]})})}),(0,e.jsx)("section",{id:"mision",className:"py-32 bg-gradient-to-br from-green-50 to-white scroll-fade opacity-0",children:(0,e.jsx)("div",{className:"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,e.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",children:[(0,e.jsxs)("div",{className:"lg:order-2 space-y-8",children:[(0,e.jsxs)("div",{className:"space-y-4",children:[(0,e.jsxs)("div",{className:"inline-flex items-center px-4 py-2 bg-amber-50 rounded-full",children:[(0,e.jsx)(v,{className:"w-5 h-5 text-amber-600 mr-2"}),(0,e.jsx)("span",{className:"text-sm font-medium text-amber-600 tracking-widest uppercase",children:"Nuestra Misi\xF3n"})]}),(0,e.jsxs)("h2",{className:"text-4xl sm:text-5xl font-light text-gray-900 leading-tight",children:["Impulsando",(0,e.jsx)("span",{className:"block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600",children:"crecimiento"})]})]}),(0,e.jsxs)("div",{className:"space-y-6",children:[(0,e.jsx)("p",{className:"text-lg text-gray-600 leading-relaxed",children:"Impulsar el crecimiento de nuestros clientes mediante servicios integrales en tres pilares fundamentales:"}),(0,e.jsxs)("div",{className:"space-y-4",children:[(0,e.jsxs)("div",{className:"flex items-start space-x-4",children:[(0,e.jsx)("div",{className:"w-3 h-3 bg-amber-400 rounded-full mt-3 flex-shrink-0"}),(0,e.jsxs)("p",{className:"text-gray-600",children:[(0,e.jsx)("span",{className:"font-medium text-gray-900",children:"Venta de autos"})," con procesos transparentes, confiables y adaptados a las necesidades reales del mercado."]})]}),(0,e.jsxs)("div",{className:"flex items-start space-x-4",children:[(0,e.jsx)("div",{className:"w-3 h-3 bg-amber-400 rounded-full mt-3 flex-shrink-0"}),(0,e.jsxs)("p",{className:"text-gray-600",children:[(0,e.jsx)("span",{className:"font-medium text-gray-900",children:"Creaci\xF3n de contenidos"})," que informan, inspiran y generan valor."]})]}),(0,e.jsxs)("div",{className:"flex items-start space-x-4",children:[(0,e.jsx)("div",{className:"w-3 h-3 bg-amber-400 rounded-full mt-3 flex-shrink-0"}),(0,e.jsxs)("p",{className:"text-gray-600",children:[(0,e.jsx)("span",{className:"font-medium text-gray-900",children:"Desarrollo de software"})," que automatiza, optimiza y transforma digitalmente negocios y experiencias."]})]})]}),(0,e.jsx)("p",{className:"text-gray-600 font-medium italic border-l-4 border-amber-200 pl-4 py-2",children:"Todo esto con un enfoque humano, profesional y centrado en la calidad."})]})]}),(0,e.jsx)("div",{className:"lg:order-1 relative",children:(0,e.jsxs)("div",{className:"grid grid-cols-2 gap-6",children:[(0,e.jsxs)("div",{className:"space-y-6",children:[(0,e.jsx)("div",{className:"aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-500",children:(0,e.jsxs)("div",{className:"text-center",children:[(0,e.jsx)("div",{className:"w-12 h-12 bg-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center",children:(0,e.jsx)("span",{className:"text-white font-bold text-lg",children:"\u{1F697}"})}),(0,e.jsx)("p",{className:"text-sm font-medium text-amber-900",children:"Autos"})]})}),(0,e.jsx)("div",{className:"aspect-square bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-500",children:(0,e.jsxs)("div",{className:"text-center",children:[(0,e.jsx)("div",{className:"w-12 h-12 bg-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center",children:(0,e.jsx)("span",{className:"text-white font-bold text-lg",children:"\u{1F4F1}"})}),(0,e.jsx)("p",{className:"text-sm font-medium text-teal-900",children:"Software"})]})})]}),(0,e.jsx)("div",{className:"pt-8",children:(0,e.jsx)("div",{className:"aspect-square bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-6 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-500",children:(0,e.jsxs)("div",{className:"text-center",children:[(0,e.jsx)("div",{className:"w-12 h-12 bg-orange-600 rounded-xl mx-auto mb-3 flex items-center justify-center",children:(0,e.jsx)("span",{className:"text-white font-bold text-lg",children:"\u2728"})}),(0,e.jsx)("p",{className:"text-sm font-medium text-rose-900",children:"Contenido"})]})})})]})})]})})}),(0,e.jsx)("section",{id:"valores",className:"py-32 bg-white scroll-fade opacity-0",children:(0,e.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[(0,e.jsxs)("div",{className:"text-center space-y-4 mb-16",children:[(0,e.jsx)("span",{className:"inline-block text-sm font-medium text-gray-500 tracking-widest uppercase px-4 py-2 bg-gray-50 rounded-full",children:"Nuestros Valores"}),(0,e.jsxs)("h2",{className:"text-4xl sm:text-5xl font-light text-gray-900",children:["Lo que nos",(0,e.jsx)("span",{className:"block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500",children:"define"})]})]}),(0,e.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10",children:[{title:"Confianza",description:"Operamos con integridad, transparencia y compromiso en cada trato y cada entrega.",icon:k,color:"from-blue-500 to-blue-600"},{title:"Innovaci\xF3n",description:"Creamos soluciones \xFAnicas en tecnolog\xEDa, marketing y comercio para mantenernos siempre un paso adelante.",icon:w,color:"from-purple-500 to-purple-600"},{title:"Versatilidad",description:"Nos adaptamos al cambio, combinando creatividad, an\xE1lisis y acci\xF3n en diferentes \xE1reas de negocio.",icon:A,color:"from-orange-500 to-orange-600"},{title:"Pasi\xF3n por el cliente",description:"Escuchamos, entendemos y resolvemos, poniendo al cliente en el centro de todo.",icon:x,color:"from-red-500 to-red-600"},{title:"Excelencia",description:"Nos enfocamos en hacer las cosas bien, desde una cotizaci\xF3n de auto hasta una l\xEDnea de c\xF3digo.",icon:y,color:"from-green-500 to-green-600"},{title:"Crecimiento compartido",description:"Generamos alianzas y oportunidades para todos los que forman parte de nuestra comunidad.",icon:E,color:"from-indigo-500 to-indigo-600"}].map((t,s)=>{let i=t.icon;return(0,e.jsxs)("div",{className:"group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2",children:[(0,e.jsxs)("div",{className:"space-y-6",children:[(0,e.jsxs)("div",{className:"relative",children:[(0,e.jsx)("div",{className:`w-20 h-20 bg-gradient-to-br ${t.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`,children:(0,e.jsx)(i,{className:"w-10 h-10 text-white"})}),(0,e.jsx)("div",{className:`absolute inset-0 w-20 h-20 bg-gradient-to-br ${t.color} rounded-2xl opacity-20 scale-125 group-hover:scale-150 transition-transform duration-500`})]}),(0,e.jsxs)("div",{className:"space-y-3",children:[(0,e.jsx)("h3",{className:"text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors",children:t.title}),(0,e.jsx)("p",{className:"text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors",children:t.description})]})]}),(0,e.jsx)("div",{className:"absolute top-4 right-4 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors",children:(0,e.jsxs)("span",{className:"text-lg font-light text-green-700",children:["0",s+1]})})]},t.title)})})]})}),(0,e.jsxs)("section",{id:"contacto",className:"py-32 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-800 scroll-fade opacity-0 relative",children:[(0,e.jsx)("div",{className:"absolute inset-0 bg-[url('/img/texture.png')] opacity-10 mix-blend-overlay"}),(0,e.jsx)("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center",children:(0,e.jsxs)("div",{className:"space-y-8",children:[(0,e.jsxs)("div",{className:"space-y-4",children:[(0,e.jsx)(g,{className:"w-12 h-12 text-green-300 mx-auto"}),(0,e.jsxs)("h2",{className:"text-4xl sm:text-5xl font-light text-white",children:["\xBFListo para ser parte de",(0,e.jsx)("span",{className:"block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-200",children:"la experiencia?"})]}),(0,e.jsx)("p",{className:"text-xl text-gray-300 leading-relaxed",children:"\xDAnete a nosotros y descubre c\xF3mo podemos transformar tu manera de ver los negocios digitales."})]}),(0,e.jsxs)("div",{className:"flex flex-col sm:flex-row gap-6 justify-center items-center",children:[(0,e.jsx)(p,{to:"/listings",className:"inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300",children:(0,e.jsx)("span",{children:"Explorar Cat\xE1logo"})}),(0,e.jsx)(p,{to:"/auth/register",className:"inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300",children:(0,e.jsx)("span",{children:"Comenzar Ahora"})})]})]})})]}),(0,e.jsx)("style",{children:`
        /* Elegant blob animation */
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        /* Soft pulse highlight animation */
        @keyframes pulseHighlight {
          0% {
            box-shadow: 0 0 0 0 rgba(167, 243, 208, 0.5);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(167, 243, 208, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(167, 243, 208, 0);
          }
        }
        
        /* Smooth floating animation */
        @keyframes floatElement {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-float {
          animation: floatElement 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        /* Elegant fade in with slight lift */
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Active navigation state */
        .nav-item.active {
          color: #047857; /* Emerald-700 */
          transform: scale(1.2);
        }
        
        .nav-item.active:after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #047857;
        }
        
        /* Pulse highlight for sections */
        .pulse-highlight {
          animation: pulseHighlight 1s cubic-bezier(0.4, 0, 0.6, 1);
        }
      `})]})}export{C as default};
