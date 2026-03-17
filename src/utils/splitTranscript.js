export const splitTranscript=(text)=>{
    const words=text.split("")   
    const chunkSize=200

    const chunks=[]

    for(let i=0;i<words.length;i+chunkSize){
            chunks.push(words.slice(i,i+chunkSize).join(" "))
    }

    return chunks
}