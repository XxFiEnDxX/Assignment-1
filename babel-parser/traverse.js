const {parse} = require('@babel/parser')
const traverse = require('@babel/traverse').default
// import {parse} from '@babel/parser'
// import {traverse} from '@babel/traverse'

// import * as parser from "@babel/parser";
// import traverse from "@babel/traverse";


const code = "2 + (4 * 10)";
// const code = "((age > 30 AND department = Sales) OR (age < 25 ANDdepartment = Marketing)) AND (salary > 50000 OR experience > 5)"

const ast = parse(code);
// const ast = parser.parse(code);

// console.log(ast.program.body[0].expression.left.value);

traverse(ast,{

    BinaryExpression: {
        enter(path){
            console.log(`( ${path.node.operator}`);
        },
        exit(path){
            console.log(`)`);
        }
    },
    NumericLiteral(path) {
        console.log(path.node.value);
    }
    // NumericLiteral: {
    //     enter(path){
    //         console.log(`Entered ${path.node.value}`);
    //     },
    //     exit(path){
    //         console.log(`Exited ${path.node.value}`);
    //     }
    // }
});