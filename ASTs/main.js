// Tokenizer
function tokenize(input) {
    const tokens = [];
    const regex = /\d+|[+*/()-]/g;
    let match;
    while ((match = regex.exec(input)) !== null) {
      tokens.push(match[0]);
    }
    return tokens;
  }
  
// Parser
  function parse(tokens) {
    let position = 0;
  
    function peek() {
      return tokens[position];
    }
  
    function consume() {
      return tokens[position++];
    }
  
    function parsePrimary() {
      const token = consume();
      if (/\d/.test(token)) {
        return { type: 'Literal', value: parseInt(token, 10) };
      } else if (token === '(') {
        const expr = parseExpression();
        consume(); // consume ')'
        return expr;
      }
    }
  
    function parseMultiplicative() {
      let node = parsePrimary();
      while (peek() === '*' || peek() === '/') {
        const operator = consume();
        const right = parsePrimary();
        node = { type: 'BinaryExpression', operator, left: node, right };
      }
      return node;
    }
  
    function parseAdditive() {
      let node = parseMultiplicative();
      while (peek() === '+' || peek() === '-') {
        const operator = consume();
        const right = parseMultiplicative();
        node = { type: 'BinaryExpression', operator, left: node, right };
      }
      return node;
    }
  
    function parseExpression() {
      return parseAdditive();
    }
  
    return parseExpression();
  }
  
// Example usage
  const input = "10*34+4*19)";
  const tokens = tokenize(input);
  console.log(tokens);
  const ast = parse(tokens);
  console.log(input);
  console.log(JSON.stringify(ast, null, 2));
  