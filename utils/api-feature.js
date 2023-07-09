import { match } from "assert";


export class ApiFeature{
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        let queryValue = { ...this.queryString }
        const expectionQuery = ["limit", "page", "fields", "sort","keyword"];
        expectionQuery.every(val => delete queryValue[val]);

        //filter with [lt , lte , gt , gte , eq]
        let queryStr = JSON.stringify(queryValue)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|eq)\b/g, match => `$${match}`);
        if (this.queryString.keyword) {
            this.filterQuery = JSON.parse(queryStr);
        } else {
            this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        }
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields)
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            if (modelName === "product") {
                this.filterQuery.$or = [
                    { title: { $regex: this.queryString.keyword, $options: "i" } },
                    { descreption: { $regex: this.queryString.keyword, $options: "i" } }
                ];
            } else {
                this.filterQuery.name = { $regex: this.queryString.keyword, $options: "i" };
            }
            this.mongooseQuery = this.mongooseQuery.find(this.filterQuery);
        }
        return this;
    }

    pagination(documentCount) {
        const page = this.queryString.page || 1;
        const limit = this.queryString.limit || 5;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;
        
        const pagination = {};
        pagination.page = page;
        pagination.limit = limit;
        pagination.pageCount = Math.ceil(documentCount / limit);

        if (endIndex < documentCount) {
            pagination.next = +page + 1
        }
        if (skip > 0) {
            pagination.previous = +page - 1;
        }

        this.paginationInfo = pagination;
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
}