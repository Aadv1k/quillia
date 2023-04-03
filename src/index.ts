import server from "./server";
import { PORT } from "./common/const";

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
})
