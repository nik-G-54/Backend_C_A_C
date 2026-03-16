import PDFDocument from "pdfkit"


export const generateNotesPDF=(notes,res)=>{


    const doc= new PDFDocument()

    res.setHeader("Content-Type","application/pdf")
    res.setHeader("Content-Disposition","attachment; filename=ai-notes.pdf")

    doc.pipe(res)

    doc.fontSize(20).text("AI Generated Study Notes",{align:"center"})
     doc.moveDown()

     notes.forEach((iteam,index)=>{
        doc.fontSize(14).text(`Q${index+1}: ${item.question}`)
        doc.moveDown(0.5)


        doc.fontSize(12).text(`Answer: ${item.answer}`)
        doc.moveDown()

     })

  doc.end()
}