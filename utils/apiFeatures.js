class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const queryObjCopy = { ...this.queryObject };
    // fields that come from the query string but are not meant to be in the query to the db
    // instead they are meant to trigger a feature (like sorting the results)
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObjCopy[el]);

    // advanced filtering: to query with operators the only thing missing is the '$' in front of the operator
    let queryString = JSON.stringify(queryObjCopy);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`,
    );
    console.log(JSON.parse(queryString));

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      // sort by more than one field (to address the cases in which more than 1 document has the same field that is 1st sorted by)
      const sortBy = this.queryObject.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      // sort by newest ones first
      this.query = this.query.sort("-createdAt _id");
    }
    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = +this.queryObject.page || 1;
    const limit = +this.queryObject.limit || 100;
    /*
     if there are 100 results and we want to show 10 by page and go
     to page 3, we should skip 20 results, hence this formula
    */
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
