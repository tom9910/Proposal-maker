import { Document, Paragraph, TextRun, AlignmentType, ThematicBreak, BorderStyle } from 'docx';

export async function generateInvoice(customerInfo: string, workItems: string, price: string) {
	const companyInfoResult = await fetch('/api/getCompanyInfo');

	if (companyInfoResult.ok) {
		const docHeaderParts = await companyInfoResult.json();

		const companyInfo: { nameAndLicenseNum: string; addressAndPhoneNum: string } = {
			nameAndLicenseNum: 'TED SANCHEZ          								LIC. # ' + docHeaderParts?.lic,
			addressAndPhoneNum: '' + docHeaderParts?.addy + '							PH. # ' + docHeaderParts?.phone
		};

		const taxValue = Number(price) * 0.08125;

		//get bullet point header
		const header = workItems
			.split('\n')
			.find((line) => line.startsWith('###'))
			?.replace(/^###\s*/, '');
		console.log('LINE', header);

		// Parse customer info
		const [name, address1, address2, phone, email] = customerInfo
			.split('\n')
			.map((line) => line.trim());

		const paragraphWithLine = new Paragraph({
			border: {
				bottom: {
					color: '#000000', // Black color
					space: 1,
					style: BorderStyle.SINGLE,
					size: 6 // Line thickness in 1/8th points
				}
			}
		});

		const doc = new Document({
			styles: {
				default: {
					document: {
						run: {
							font: 'Cambria'
						}
					}
				}
			},
			sections: [
				{
					properties: {},
					children: [
						// Header - Invoice
						new Paragraph({
							alignment: AlignmentType.RIGHT,
							children: [
								new TextRun({
									text: 'INVOICE',
									bold: true,
									size: 32,
									color: '#000000'
								})
							]
						}),

						paragraphWithLine,

						new Paragraph({
							children: [new ThematicBreak()]
						}),

						// Company Information
						new Paragraph({
							children: [
								new TextRun({
									text: companyInfo.nameAndLicenseNum,
									bold: true,
									italics: true,
									size: 20
								})
							]
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: companyInfo.addressAndPhoneNum,
									bold: true,
									italics: true,
									size: 20
								})
							]
						}),
						new Paragraph({
							alignment: AlignmentType.LEFT,
							children: [
								new TextRun({
									text: 'SANTA FE NM, 87505',
									bold: true,
									italics: true,
									size: 20
								})
							]
						}),

						new Paragraph({
							children: []
						}),

						// Work Location and Date
						new Paragraph({
							children: [
								new TextRun({
									text: 'DATE: ' + new Date().toLocaleDateString(),
									bold: true,
									size: 22
								})
							]
						}),

						new Paragraph({
							children: []
						}),

						new Paragraph({
							children: [
								new TextRun({
									text: 'WORK PERFORMED AT: ',
									bold: true,
									size: 24
								})
							]
						}),
						new Paragraph({
							children: [] // Just newline without text
						}),

						// Customer Address
						new Paragraph({
							children: [
								new TextRun({
									text: address1.replace(/\*\*/g, ''),
									bold: true
								})
							]
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: address2.replace(/\*\*/g, ''),
									bold: true
								})
							]
						}),

						new Paragraph({
							children: [
								new TextRun({
									text: name.replace(/\*\*/g, ''),
									bold: true
								})
							]
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: email.replace(/\*\*/g, ''),
									bold: true
								})
							]
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: phone.replace(/\*\*/g, ''),
									bold: true
								})
							]
						}),

						// Description Header
						new Paragraph({
							alignment: AlignmentType.CENTER,
							children: [
								new TextRun({
									text: '\nDESCRIPTION OF WORK PERFORMED:',
									bold: true,
									size: 24,
									color: '#000000'
								})
							]
						}),
						new Paragraph({
							children: [] // Just newline without text
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: header === null ? '' : header,
									bold: true
								})
							]
						}),
						new Paragraph({
							children: [] // Just newline without text
						}),

						// Work Items
						...workItems
							.split('-')
							.map((item) => item.trim())
							.filter((item, index) => item && index > 0)
							.map(
								(item) =>
									new Paragraph({
										bullet: {
											level: 0
										},
										children: [
											new TextRun({
												text: item.trim(),
												bold: true
											})
										]
									})
							),
						new Paragraph({
							children: [] // Just newline without text
						}),

						// Amount due
						new Paragraph({
							children: [
								new TextRun({
									text: 'SUBTOTAL:  $' + price,
									bold: true
								})
							]
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: 'TAX:  $' + taxValue,
									bold: true
								})
							]
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: 'TOTAL:  $' + (Number(price) + taxValue),
									bold: true
								})
							]
						}),
						new Paragraph({
							children: [] // Just newline without text
						}),

						// Signature Line
						new Paragraph({
							children: [
								new TextRun({
									text: 'RESPECTFULLY SUBMITTED PER TED SANCHEZ',
									bold: true,
									size: 22
								})
							]
						}),
						new Paragraph({
							children: [] // Just newline without text
						})
					]
				}
			]
		});
		return doc;
	} else {
		console.log('error getting company info');
		return { error: 'error getting company info' };
	}
}

// for testing

// // Example usage:
// const customerInfo = `Tom Sanchez
// 5555 Cherry Hills Drive NE
// Albuquerque, New Mexico 87111
// (505) 555-5555
// tomasanchez@gmail.com`;

// const workItems = `REMOVE EXSISTING SHINGLES
// -INSPECT DECK, REPLACE DAMAGED PLYWOOD ($3 SF)
// -INSTALL NEW ROOF JACKS
// -INSTALL NEW DRIP EDGE
// -INSTALL SYNTHETIC VAPOR BARRIER
// -INSTALL NEW STARTER SHINGLES
// -INSTALL 30 YEAR DIMENSIONAL SHINGLE
// -INSTALL MODIFIED BITUMEN OVER BACK PORCH
// -APPLY PLASTIC CEMENT AROUND ROOF PENETRATIONS AND VENTS
// -CLEAN JOB SITE WHEN COMPLETE
// -10 YEAR WARRANTY AGAINST LEAKS
// -inspect all tiles`;

// Generate the document
// const doc = generateProposal(customerInfo, workItems);

// const [name, address1, address2, phone, email] = customerInfo
// 	.split('\n')
// 	.map((line) => line.trim());

// Packer.toBuffer(doc).then((buffer) => {
// 	writeFileSync('Proposal-' + address1 + '-' + name + '.docx', buffer);
// });
