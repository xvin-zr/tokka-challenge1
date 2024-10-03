import app from './server';

const PORT = 3003;

app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`);
});
