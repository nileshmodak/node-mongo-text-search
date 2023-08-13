module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean
    },
    { timestamps: true }
  );

  schema.index(
    {
        title :'text',
        description :'text'
    },
    {
        weights : 
            { 
                title : 5, 
                description : 2
            }
     }
  );

  schema.statics = {
    searchPartial: function(q, callback) {
        return this.find({
            $or: [
                { "title": new RegExp(q, "gi") },
                { "description": new RegExp(q, "gi") },
            ]
        }, callback)
    },

    searchFull: function (q, callback) {
        return this.find({
            $text: { $search: q, $caseSensitive: false }
        }, callback)
    },

    search: function(q, callback) {
        this.searchFull(q, (err, data) => {
            if (err) return callback(err, data);
            if (!err && data.length) return callback(err, data);
            if (!err && data.length === 0) return this.searchPartial(q, callback);
        });
    },
}

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tutorial = mongoose.model("tutorial", schema);
  return Tutorial;
};
