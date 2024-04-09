export interface ICreateProduct {
    nome: string;
    dataFabricacao:  Date;
    dataVencimento: Date;
    quantidade: number;
    valorUnitario: number;
    perecivel: boolean;
    imagem: string; // Adicionamos o campo imagem
}

// model Produto {
//     id                 Int       @id @default(autoincrement())
//     nome               String    // Nome do Produto
//     dataFabricacao     DateTime  // Data de fabricação
//     dataVencimento     DateTime  // Data de vencimento
//     quantidade         Int       // Quantidade do produto
//     valorUnitario      Float     // Valor unitário
//     valorTotal         Float     // Valor total
//     perecivel          Boolean   // Produto perecível ou não
//     createdAt          DateTime  @default(now())
//     updatedAt          DateTime  @updatedAt
//     imagem             String    //Imagem
//   }