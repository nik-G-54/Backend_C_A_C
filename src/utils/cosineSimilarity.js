export const cosineSimilarity = (A,B)=>{

 let dot=0
 let magA=0
 let magB=0

 for(let i=0;i<A.length;i++){

  dot+=A[i]*B[i]
  magA+=A[i]*A[i]
  magB+=B[i]*B[i]

 }

 magA=Math.sqrt(magA)
 magB=Math.sqrt(magB)

 return dot/(magA*magB)

}