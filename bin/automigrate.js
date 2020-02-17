const path = require("path");

const app = require(path.resolve(__dirname, "../server/server"));
const allModels = require("../server/model-config.json");
const {
  user: initialUsers,
  Room: initialRooms
} = require("./initialData.json");

const datasource = app.datasources.mySQL;

const excludeModels = ["_meta", "User"];

const automigrate = async startAutomigration => {
  await executeAutomigration();
  await populateInitialData();
  await disconnectDatasource();
  console.log("Complete!");
};

// step 1:

async function executeAutomigration() {
  const models = Object.keys(allModels).filter(
    model => !excludeModels.includes(model)
  );

  const migratePromises = models.map(model => datasource.automigrate(model));

  return Promise.all(migratePromises);
}

// step 2:

function populateInitialData() {
  function createMockData(model, dataSet) {
    return Promise.all(
      dataSet.map(async element => {
        await model.create(element);
        console.log("Created data:", element);
      })
    );
  }

  return Promise.all([
    createMockData(app.models.Room, initialRooms),
    createMockData(app.models.user, initialUsers)
  ]);
}

// step 3:

const disconnectDatasource = () => datasource.disconnect();

automigrate();
