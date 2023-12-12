import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let sequelize;

(async () => {
    sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        database: 'my_db',
        username: 'postgres',
        password: 'postgres',
        port: 5432,
    });

    async function connect() {
        let retries = 5;
        while (retries) {
            try {
                await sequelize.authenticate();
                console.log('Connection has been established successfully.');
                return sequelize;
            } catch (err) {
                console.error('Unable to connect to the database:', err);
            }
            retries -= 1;
            console.log(`retries left: ${retries}`);
            // wait 5 seconds
            await new Promise(res => setTimeout(res, 5000));
        }
    }

    // await sequelize.sync({ force: true });
    await connect();
})();

export default sequelize;