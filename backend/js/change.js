function encrypt(dbId){
    const apiId = ( 6 * dbId ) + 345;
    return apiId;
}

function decrypt(apiId){
    const dbId = ( apiId - 345 ) / 6;
    return dbId;
}

module.exports = { encrypt, decrypt };