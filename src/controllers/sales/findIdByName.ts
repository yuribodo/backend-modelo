import prisma from "../../services/prisma.services";

export const fyndIdByName = async (nome: string) =>{
    const products = await prisma.produto.findMany(
        {
            where: {
                nome: nome
            },
            select: { id: true },

        },
    );
    return products;
}
