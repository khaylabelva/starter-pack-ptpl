let products = [];
let idCounter = 1;

exports.getProducts = (req, res) => {
    res.json(products);
}

exports.createProduct = (req, res) => {
    const { name, description, quantity, price } = req.body;
    const newProduct = {
        id: idCounter++,
        name,
        description,
        quantity,
        price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
}

exports.updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, quantity, price } = req.body;
    const product = products.find (i => i.id === id);
    if (!product) return res.sendStatus(404);
    product.name = name;
    product.description = description;
    product.quantity = quantity;
    product.price = price;
    res.json(product);
}

exports.deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(i => i.id === id);
    if (index === -1) return res.sendStatus(404);
    products.splice(index, 1);
    res.sendStatus(204);
}