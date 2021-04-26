## Similarity experiments

This folder contains work on exploring different approaches to finding initial grouping of columns and id's to seed the crowdsourced work of producing clean cross walks for each.

The structure is as follows

- Canonical_ids : Should contain any id's that we are using as a canonical set, either for columns or for ids within columns. These should be a csv file with a list of the id's with a filename that clearly indicates where they come from and what the pertain to.

- Scripts: Any processing scripts that can be run to try a specific text distance or clustering methods

- Results: Should include the outputs of the experiment following the format specified below. One file per method, named after that method.

### Output format

For columns we want to go with

```json
[
  {
    "canonical_id": "school_name",
    "metrtic": "text distance",
    "mapped_values": [
      {
        "val": "school name",
        "confidence": 1.0
      },
      {
        "val": "sch00l name",
        "confidence": "0.2"
      }
    ]
  },
  {
    "canonical_id": "department",
    "mapped_values": [
      {
        "val": "dept",
        "confidence": 0.5
      },
      {
        "val": "partment",
        "confidence": 0.2
      }
    ]
  }
]
```

And for id's within columns we want to use

```json
[
  {
    "column": "school name",
    "mappings": [
      {
        "canonical_id": "school_name",
        "mapped_values": [
          {
            "val": "school name",
            "confidence": 1.0
          },
          {
            "val": "sch00l name",
            "confidence": "ScHoOl NaMe!"
          }
        ]
      },
      {
        "canonical_id": "department",
        "mapped_values": [
          {
            "val": "dept",
            "confidence": 0.5
          },
          {
            "val": "partment",
            "confidence": 0.2
          }
        ]
      }
    ]
  }
]
```
