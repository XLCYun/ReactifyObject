function revisionInfoFunc() {
  return {
    create_date: new Date(),
    name: this.tree.name,
    path: this.tree.path
  }
}

module.exports = revisionInfoFunc
