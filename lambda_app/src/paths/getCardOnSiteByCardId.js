export const getCardOnSiteByCardId = async (request, context) => {
    return { message: "You called me with: " + request.paths.cardId} ;
}