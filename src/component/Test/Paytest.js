import React from 'react'
import './test.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
const Paytest = () => {

const paymentid= "Pajasdl2asdk"

const downloadPDF = () => {
    const content = document.getElementById('pdf-content');

    html2canvas(content, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth * 0.8;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${paymentid}.pdf`);
    });
  };
  return (
  <div className='eachbooking' style={{display:'flex',padding:"20px",flexDirection:'column',alignContent:'center',justifyContent:'center',minHeight:"90vh"}}>
    <div id='pdf-content' class="container">
    <div class="half-circle">
      <h1>Ticket</h1>
    </div>
  </div>
  <div style={{padding:"20px"}}>
   <button onClick={downloadPDF}>Download <span><Download height={16} /></span></button>
  </div>
  </div>

  )
}

export default Paytest
