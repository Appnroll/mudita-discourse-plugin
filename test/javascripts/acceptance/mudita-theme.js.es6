import { acceptance } from "helpers/qunit-helpers";

acceptance("MuditaTheme", { loggedIn: true });

test("MuditaTheme works", async assert => {
  await visit("/admin/plugins/mudita-theme");

  assert.ok(false, "it shows the MuditaTheme button");
});
