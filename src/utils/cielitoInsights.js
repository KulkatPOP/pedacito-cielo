import { MEASUREMENT_EVENTS } from './measurement.js';

const INTENT_LABELS = Object.freeze({ products:'Productos', orders:'Pedidos', prices:'Precios', hours:'Horarios', location:'Ubicación', social:'Redes sociales', events:'Celebraciones y eventos', custom_products:'Productos personalizados', general:'Información general' });
const productState=(product={})=>String(product.estado||(product.disponible===false?'agotado':'disponible')).toLowerCase();
const productCategory=(product={})=>product.categoria||product.categorias?.nombre||'';
const rank=(counts)=>Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
const increment=(counts,key)=>key?{...counts,[key]:(counts[key]||0)+1}:counts;

export function generateCielitoInsights(events=[],products=[]){
 const availableProducts=products.filter(product=>productState(product)==='disponible'&&product.disponible!==false);
 const byId=new Map(availableProducts.map(product=>[String(product.id),product]));
 const byName=new Map(availableProducts.map(product=>[String(product.nombre).toLowerCase(),product]));
 let intentCounts={},productCounts={},categoryCounts={},purchaseIntents=0;
 for(const event of events){
  if(event.name===MEASUREMENT_EVENTS.CHATBOT_QUESTION&&INTENT_LABELS[event.questionKey])intentCounts=increment(intentCounts,INTENT_LABELS[event.questionKey]);
  if(event.name===MEASUREMENT_EVENTS.CHATBOT_PURCHASE_INTENT)purchaseIntents+=1;
  if(![MEASUREMENT_EVENTS.CHATBOT_QUESTION,MEASUREMENT_EVENTS.WHATSAPP_CLICK].includes(event.name))continue;
  const product=(event.productId!=null&&byId.get(String(event.productId)))||(event.productName&&byName.get(String(event.productName).toLowerCase()));
  if(!product)continue;
  productCounts=increment(productCounts,product.nombre);
  categoryCounts=increment(categoryCounts,productCategory(product));
 }
 const intents=rank(intentCounts),productRanking=rank(productCounts),categories=rank(categoryCounts),recommendations=[];
 if(categories[0])recommendations.push(`La categoría ${categories[0][0]} concentra el mayor interés registrado (${categories[0][1]}).`);
 if(productRanking[0])recommendations.push(`${productRanking[0][0]} es el producto disponible con más consultas (${productRanking[0][1]}).`);
 if(intents[0])recommendations.push(`La consulta más frecuente es ${intents[0][0].toLowerCase()}; conviene mantener esa información visible y actualizada.`);
 return {totalQuestions:intents.reduce((total,[,count])=>total+count,0),purchaseIntents,intents,products:productRanking,categories,frequentQuestions:intents,recommendations};
}

export {INTENT_LABELS};
