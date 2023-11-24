import prisma from "../../services/prisma.services";

const verifyName = async (nome: string) => {
    const nomeLowerCase = nome.toLowerCase();
    const products = await prisma.produto.findMany(
        {
            where: {
                nome: {
                    contains: nomeLowerCase,
                },
            },
            select: { nome: true },

        },
    );
    return products;

}
export default verifyName;