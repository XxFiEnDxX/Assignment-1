const {parse} = require('@babel/parser')
// import {parse} from '@babel/parser'

const code = "2 + (4 * 10)";
// const code = "((age > 30 AND department = Sales) OR (age < 25 ANDdepartment = Marketing)) AND (salary > 50000 OR experience > 5)"

const ast = parse(code);

console.log(ast.program.body[0]);

// console.log(ast.program.body[0].expression.left.value);
// console.log(ast.program.body[0].expression.left.value);