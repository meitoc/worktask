const filterField = (inputTask, inputFieldList) =>{
    const filteredResult ={}
    for (const field in inputFieldList) {
        if (inputFieldList[field] === 1 && inputTask[field]) {
        filteredResult[field] = inputTask[field];
        }
    }
    return filteredResult;
}
module.exports =  {filterField}