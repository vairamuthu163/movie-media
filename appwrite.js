import { Client, Databases, ID, Query, TablesDB } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Check if document is already exists
  // 2. If exists, update the count
  // 3. If not, create a new document with count = 1
  try {
    const results = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    if (results.rows.length > 0) {
      const existingDocument = results.rows[0];

      await database.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: existingDocument.$id,
        data: {
          count: existingDocument.count + 1,
        },
      });
    } else {
      await database.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://images.tmdb.org/t/p/w500/${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const results = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.orderDesc("count"), Query.limit(10)],
    });

    return results.rows;
  } catch (error) {
    console.log(error);
  }
};
