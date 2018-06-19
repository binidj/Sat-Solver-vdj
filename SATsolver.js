exports.solve = function (fileName) {
    let formula = readFormula(fileName)
    let result = doSolve(formula.clauses, formula.variables)
    return result
}
function nextAssignment(assignment) {
    let aux = false
    for (let a = assignment.length - 1; a >= 0 && !aux; a--) {
        if (assignment[a]) {
            // vai um
        } else {
            aux = true       // somando sempre 1 nos binarios garante que testamos todas as possibilidades
        }
        assignment[a] = !assignment[a]
    }
    if (aux) {
        return assignment
    } else return null // significa que todos os numeros do assignment sao 1 e todas as possibilidades foram testadas
}
function doSolve(clauses, assignment) {
    let isSat = false
    let aux = false
    let op = false // variavel auxliar para calcular o valor verdade das clausulas
    while (!isSat && !aux) {
        for (let a = 0; a < clauses.length && !aux; a++) {
            for (let b = 0; b < clauses[a].length && !aux && !op; b++) {
                let num = clauses[a][b]
                let term
                if (num > 0) {
                    term = assignment[num - 1] // chama a atribuição do assingment
                } else term = !assignment[Math.abs(num) - 1]
                op = term || op
            }
            if (op) {
                op = false // clausula satisfeita, continue o loop
            } else {
                aux = true // se op e falso a clausula nao foi satisfeita, parando o loop e chamando o next assingment
            }
        }
        if (!aux) {
            isSat = true // se nao aux significa que o loop operou todas as clausulas e todas foram verdadeiras
        } else {
            assignment = nextAssignment(assignment)
            if (assignment != null) { // se o assigment for null significa que todas as possibilidades foram testadas e nao permite q o loop continue
                aux = false
            }
        }
    }
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment
    }
    return result
}
function readFormula(fileName) {
    var fs = require('fs')
    let text = fs.readFileSync(fileName).toString().split("\n")
    let clauses = readClauses(text)                                 // executa todas as funcoes de leitura
    let variables = readVariables(clauses)
    let specOk = checkProblemSpecification(text, clauses, variables)
    let result = { 'clauses': [], 'variables': []}
    if (specOk) {
        result.clauses = clauses
        result.variables = variables
    }
    return result
}
function readClauses(text) {
    let aux = []
    let clauses = []
    for (let a = 0; a < text.length; a++) {
        if (text[a].charAt(0) == "c" || text[a].charAt(0) == "p" || text[a].charAt(0) == "" ) {
            // pula linhas com c, p ou vazias
        } else {
            aux.push(text[a]) // insere as variaveis num array auxiliar
        }
    }
    let X = aux.join()
    X = X.replace(/\s+/g,' ') // elimina espacos
    X = X.replace(/, /g, ',')
    aux = X.split(",")
    for (let a = 0; a < aux.length; a++) {
        aux[a] = aux[a].split(" ") // transforma cada clausula em um array contendo as variaveis
    }
    for (let a = 0; a < aux.length; a++) {
        if (aux[a][aux[a].length - 1] == 0) {
            aux[a].pop()
            clauses.push(aux[a])    // checa se o ultimo elemento e um zero, removendo-o e adicionando no array clauses
        } else {
            aux[a].concat(aux[a + 1]) // se nao for zero concatena com o proximo e repete o a checagem
        }
    }
    return clauses
}
function readVariables(clauses) {
    let V = []
    for (let t = 0; t < clauses.length; t++) {
        for (let k = 0; k < clauses[t].length; k++) {
            V[Math.abs(clauses[t][k]) - 1] = false // para todas as clausulas, se atribui o valor falso a posicao correnspondente
        }
    }
    return V.fill(false)
}
function checkProblemSpecification(text, clauses, variables) {
    let K = true
    let i = 0
    while (K) {
        if(text[i].charAt(0) == "p") { // checa se a leitura dos dados batem  com a especificacao do problema
            K = false
        } else i++
    }
    let E = text[i].split(" ")
    if (clauses.length == parseInt(E[3]) && variables.length == parseInt(E[2])) {
        return true
    } else return false
}