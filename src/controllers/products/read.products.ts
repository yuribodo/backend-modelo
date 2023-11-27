import prisma from "../../services/prisma.services";

async function products() {
    try {
        const allProducts = await prisma.produto.findMany();
        return(allProducts);
    } catch (err) {
        console.error(err);
        return({ message: "Erro ao consultar produtos" })
    }
}
export default products;