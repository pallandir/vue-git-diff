<template>
  <div
    class="container"
    v-for="(diffItem, diifIndex) in diffList"
    :key="diffIndex"
  >
    <code>
      <p
        v-for="(line, index) in diffItem.diff.split('\n')"
        :key="index"
        class="preserve-space"
        :class="getBaseClass(line, index, diffItem)"
      >
        <span class="index">{{ getLineIndex(line, index, diffItem) }}</span>
        <span :class="index === 0 ? '' : 'key'"> {{ getKey(line) }}</span>
        <span class="value">{{ getValue(line) }} </span>
      </p>
    </code>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { diffType } from "../Types/diffTypes";

const diffList = reactive<diffType[]>([
  {
    diff: "@@ -71,6 +71,8 @@\n sudo -u git -H bundle exec rake migrate_keys RAILS_ENV=production\n sudo -u git -H bundle exec rake migrate_inline_notes RAILS_ENV=production\n \n+sudo -u git -H bundle exec rake gitlab:assets:compile RAILS_ENV=production\n+\n ```\n \n ### 6. Update config files",
    new_path: "doc/update/5.4-to-6.0.md",
    old_path: "doc/update/5.4-to-6.0.md",
    a_mode: null,
    b_mode: "100644",
    new_file: false,
    renamed_file: false,
    deleted_file: false,
    generated_file: null,
  },
]);

function parseStartIndex(header: string): number {
  const match = header.match(/^@@ -\d+,\d+ \+(\d+),?/);
  return match ? parseInt(match[1]) : 0;
}

function getLineIndex(
  line: string,
  index: number,
  diffItem: diffType,
): string | number {
  if (index === 0) return "";
  const headerLine = diffItem.diff.split("\n")[0];
  const startLine = parseStartIndex(headerLine);
  return startLine + index - 1;
}

function getClassColor(line: string): string {
  if (line.startsWith("+")) return "content-added";
  if (line.startsWith("-")) return "content-deleted";
  return "";
}

function getBaseClass(
  line: string,
  index: number,
  diffItem: diffType,
): string[] {
  const classes = [];
  if (index === 0) classes.push("first-line");
  else {
    classes.push(getClassColor(line));
    if (index > 1 && diffItem.diff.split("\n")[index - 1] === "") {
      classes.push("add-margin");
    }
  }
  return classes;
}

function getKey(line: string): string {
  if (!line.includes(":")) return line.trim();
  return line.split(":")[0] + " :";
}

function getValue(line: string): string {
  if (!line.includes(":")) return "";
  return line.split(":").slice(1).join(":").trim();
}
</script>

<style scoped>
.container {
  background-color: #1d1f21ff;
  color: white;
}

.preserve-space {
  white-space: pre;
  padding: 5px;
}

.first-line {
  background-color: #343638ff;
  color: #707273ff;
}

.content-added {
  background-color: #1f3622ff;
}

.content-deleted {
  background-color: #4a2324ff;
}

.key {
  color: #4586bfff;
}

.value {
  color: #b4bd68ff;
  margin-left: 5px;
}

.index {
  margin-right: 5px;
  width: 35px;
  padding-right: 5px;
  display: inline-block;
}

.add-margin {
  margin-top: 10px;
}
</style>
