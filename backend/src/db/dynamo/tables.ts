const DB_TABLES = {
    USERS: {
        tableName:"Users",
        primaryKey: "userId",
    },
    TRAINERS: {
        tableName:"TrainerClientAssociations",
        primaryKey:"trainerId",
        sortKey:"clientId"
    },
    TRAINERS_INDEX_BY_CLIENTS: {
        tableName:"TrainerClientAssociations",
        asIndex:"clientId-trainerId-index",
        primaryKey:"clientId",
        sortKey:"trainerId"
    },
    TRAINER_REQUESTS: {
        tableName:"TrainerClientRequests",
        primaryKey:"trainerId",
        sortKey:"clientId"
    },
    TRAINER_REQUESTS_BY_CLIENT: {
        tableName:"TrainerClientRequests",
        asIndex:"clientId-trainerId-index",
        primaryKey:"clientId",
        sortKey:"trainerId"
    }
}

export default DB_TABLES;