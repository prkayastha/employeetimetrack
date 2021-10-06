const models = require('../../models');
const trelloQuery = new (require('./Query'));

module.exports = async function (userId, projectId) {
    const userAuth = await models.TrelloAuths.findOne({ where: { UserId: userId } });
    if (!userAuth) {
        throw Error('Cannot find authenticationKey');
    }
    const tokenPair = {
        accToken: userAuth.accessToken,
        accTokenSecret: userAuth.accessTokenSecret
    };

    const projectInfo = await getProjectInfo(tokenPair, projectId, userId);
    const projectResult = await insertBoardIntoDB(userId, projectInfo)
    const cards = await getCards(tokenPair, projectId);
    const result = insertCardIntoDb(projectResult.id, cards);
    return cards;

}

async function getProjectInfo(tokenPair, projectId, userId) {
    let boardInfo = await trelloQuery.getBoardInfo(tokenPair, projectId);
    boardInfo = JSON.parse(boardInfo);
    const project = {
        projectName: boardInfo.name,
        isDelete: false,
        createdByUserId: userId,
        projectOwnerUserId: userId,
        trelloBoardId: boardInfo.id
    }
    return project;
}

async function getCards(tokenPair, boardId) {
    let boardList = await trelloQuery.getCardsOnBoard({ tokenInfo: tokenPair, id:boardId });
    boardList = JSON.parse(boardList);
    return boardList;
}

async function insertBoardIntoDB(userId, project) {
    let trelloProject = await models.Project.findOne({
        where: {trelloBoardId: project.trelloBoardId, isDelete: false}
    });

    if (!!trelloProject) {
        if (userId != trelloProject.projectOwnerUserId) {
            const error = new Error('The project is imported by another user');
            error.name = 'DuplicateProject'
            throw error;
        }

        project.id = trelloProject.id;
        trelloProject = await models.Project.update(project, {
            where: {trelloBoardId: project.trelloBoardId, isDelete: false, projectOwnerUserId: userId}
        })
        
        return project;
    }

    trelloProject = await models.Project.create(project);
    return trelloProject;
}

async function insertCardIntoDb(projectId, cards) {
    return new Promise((resolve, reject) => {
        cards.forEach(async (card) => {
            const task = await models.Task.findOne({
                where: { trelloCardId: card.id }
            });
    
            if (!!task) {
                const result = await models.Task.update({
                    taskDescription: card.name
                }, { where: {trelloCardId: card.id} });
                return;
            }
    
            const insertResult = await models.Task.create({
                taskDescription: card.name,
                isDelete: false,
                trelloCardId: card.id,
                projectId: projectId
            });
            return
        });
        resolve(true);
    });
    
}