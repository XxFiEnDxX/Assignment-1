function tokenize(input) {
    const tokens = [];
    const regex = /\bAND\b|\bOR\b|>=|<=|>|<|=|\(|\)|\b[a-zA-Z_]\w*|\'[^\']*\'|\d+/g;
    let match;
    while ((match = regex.exec(input)) !== null) {
      tokens.push(match[0]);
    }
    return tokens;
  }
  
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
      if (token === '(') {
        const expr = parseExpression();
        consume(); // consume ')'
        return expr;
      } else if (/^\d+$/.test(token)) {
        return { type: 'Literal', value: parseInt(token, 10) };
      } else if (/^'[^']*'$/.test(token)) {
        return { type: 'Literal', value: token.slice(1, -1) }; // remove quotes
      } else {
        return { type: 'Identifier', name: token };
      }
    }
  
    function parseComparison() {
      const left = parsePrimary();
      const operator = consume();
      const right = parsePrimary();
      return { type: 'Comparison', operator, left, right };
    }
  
    function parseLogicalExpression() {
      let left = parseComparison();
  
      while (peek() === 'AND' || peek() === 'OR') {
        const operator = consume();
        const right = parseComparison();
        left = { type: 'LogicalExpression', operator, left, right };
      }
  
      return left;
    }
  
    function parseExpression() {
      let left = parseLogicalExpression();
  
      while (peek() === 'AND' || peek() === 'OR') {
        const operator = consume();
        const right = parseLogicalExpression();
        left = { type: 'LogicalExpression', operator, left, right };
      }
  
      return left;
    }
  
    return parseExpression();
  }
  
  // Example usage
  const input1 = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";
  const tokens1 = tokenize(input1);
  const ast1 = parse(tokens1);
  
  console.log(JSON.stringify(ast1, null, 2));
  