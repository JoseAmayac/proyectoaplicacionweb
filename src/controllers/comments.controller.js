
const comments = [];

const index = (req, res) => {
    return res.json({
        ok: true,
        comments
    });
}

const store = (req, res) => {
    const { name, email, comment } = req.body;

    if (!name || !email || !comment) {
        return res.status(422).json({
            ok: false,
            message: "Faltan datos obligatorios"
        });
    }

    comments.unshift({ name, email, comment });

    return res.status(201).json({
        ok: true,
        message: "Comentario guardado"
    });
}

module.exports = { index, store };