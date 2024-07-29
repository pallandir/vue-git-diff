<template>
  <div class="container" v-for="diffItem in diffList" :key="diffItem.diff">
    <code>
      <p
        v-for="(line, index) in diffItem.diff.split('\n')"
        class="preserve-space"
        :class="getBaseClass(line, index)"
      >
        <span class="index">{{ getCurrentIndex(line, index) }}</span>
        <span :class="index === 0 ? '' : 'key'"> {{ getKey(line) }}</span>
        <span class="value">{{ getValue(line) }} </span>
      </p></code
    >
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
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

let tokens = ref<string[]>([]);
let start = ref<number>(0);
let offset = ref<number>(0);
const getCurrentIndex = (line: string, index: number) => {
  if (index === 0) {
    tokens.value = line.split(" ");
    start.value = Math.abs(Number(tokens.value[1].split(",")[0]));
    offset.value = Math.abs(Number(tokens.value[1].split(",")[1]));
  }

  return start.value + index;
};

const getClassColor = (line: string, index: number) => {
  if (index === 0) {
    return "first-line";
  }
  if (line.startsWith("+")) {
    return "content-added";
  } else if (line.startsWith("-")) {
    return "content-deleted";
  } else {
    return "";
  }
};

const checkUpdatedContentIndex = (index: number) => {
  console.log(offset.value, index);
  if (index == offset.value+1) {
    return true;
  }

  return false;
};

const getBaseClass = (line: string, index: number) => {
  console.log("in base class");
  const color = getClassColor(line, index);
  const margin = checkUpdatedContentIndex(index) ? "add-margin" : "";

  return [color, margin];
};

const getKey = (line: string) => {
  return line.includes(": ") ? `${line.split(": ")[0]} :` : line.trim();
};

const getValue = (line: string) => {
  return line.split(": ")[1];
};
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
