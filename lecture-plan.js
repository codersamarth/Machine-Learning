(function(){
"use strict";
var C=window.ML_CURRICULUM;
if(!C||!Array.isArray(C.lessons))throw new Error("Load curriculum.js before lecture-plan.js");
var additions=[];
function add(id,lecture,title,hook,simple,university,analogy,formula,code,pitfall,question,choices,correct,source){
 additions.push({id:id,lecture:lecture,title:title,hook:hook,simple:simple,university:university,analogy:analogy,formula:formula,code:code,pitfall:pitfall,question:question,choices:choices.split("|"),correct:correct,source:source});
}
// LECTURE 1 — course vocabulary, AI boundaries, Python and Google Colab.
add("m14",1,"Why this course uses ML, optimization and Python","What should you be able to check independently at the end of the course?",
"Your goal is not to memorise generated code. You should recognise which business problem is being solved, inspect data, understand the procedure, question results and connect predictions to decisions. The course moves from cleaning raw data to supervised methods, unsupervised methods and optimization. Practice and the lecture exercise notebooks are central to this learning-by-doing approach.",
"Machine learning makes inferences from examples; optimization chooses an action under constraints. Python notebooks let you implement and audit both. Lecture 1 also previews the course sequence, participation expectations, homework, a midterm and a final. Administrative details are not substitutes for the current official course page.",
"Be the manager who can challenge a supplier's spreadsheet, not just forward its output.","raw data → cleaned data → analytical model → checked insight → decision",
"question = 'What is being predicted?'\nprint(question)",
"A model's prediction is not automatically an optimal business decision.","Which ability is an explicit aim of the course?","Recognise and check what code and models do|Memorise every programming library|Assume an AI-generated result must be accurate",0,"Lecture 1 handout, pp. 4–5, 23–26 and 33–36");
add("m9",1,"What does ‘AI’ actually mean?","Does adding the word AI to a product prove it uses a particular algorithm?",
"No. Artificial intelligence is a broad label, and its meaning depends on the definition being used. A chatbot, fraud detector, thermostat and route planner may be classified differently under different definitions or regulations. In this course, machine learning and optimization are treated as more precisely defined ideas. Ask what input, model and action are actually involved.",
"The lecture compares classifications under the EU AI Act, an ISO standard and marketing descriptions. These definitions do not necessarily include the same technologies. A technology's commercial label should not be treated as evidence of its computational method or legal status.",
"A label reading ‘healthy’ on a snack does not tell you the ingredients; 'AI-powered' does not tell you what algorithm runs.",
"AI is a broad category; ML and optimization are better-defined tools",
"claim = 'AI-powered forecasts'\nprint('What data, model and validation support this claim?')",
"Do not infer from the term 'AI' that a product learns, predicts, optimizes or complies with a particular law.",
"What question best tests an AI marketing claim?","Which actual algorithm and evidence are behind it?|Does its homepage have a robot icon?|Is the brand well known?",0,
"Lecture 1 handout, pp. 18–20 (definitions and AI-or-not-AI comparisons)");
add("m10",1,"Generative AI versus LLMs","Is an LLM the same thing as all of AI?",
"No. Generative AI produces new content such as text, images or code from patterns learned in existing material. A large language model, or LLM, is a language-focused generative model, especially associated with generating text. Not every AI application is generative, and not every generative AI model is an LLM.",
"The lecture introduces generative AI as a family of content-producing models and LLMs as a prominent example. It notes that LLM development can involve supervised and reinforcement learning methods. This lecture introduces rather than fully teaches these methods.",
"A forecasting spreadsheet gives a number; an LLM drafts a paragraph. Both can be called AI, but their outputs and evaluation differ.",
"Generative AI ⊃ text-generating LLMs (as a class)",
"task = 'Summarise this report'\nprint(task)",
"An LLM-written explanation or code snippet still needs to be checked for factual and programming errors.",
"Which statement is most accurate?","All AI is an LLM|LLMs are an example of generative AI|All optimization is generative AI",1,
"Lecture 1 handout, p. 21 (Generative AI and LLMs)");
add("m11",1,"Google Colab, imports, operators and Python types","What happens before you can use pandas or NumPy in a notebook?",
"Google Colab runs Python inside notebook cells. A package provides existing functions; an import brings the package into your current Python session. Python has values of different types: integers, decimals, text and Booleans. '+' adds, '/' divides, '**' raises to a power and '#' starts a comment. Execute prerequisite cells before using their variables.",
"Using 'import pandas as pd' binds a short alias to a module. Notebook state depends on which cells you have run, not merely their visual order. Packages may already be installed in Colab, but imported names still need to be defined.",
"A notebook is like a kitchen where tools must be brought to the counter before you use them.",
"2 ** 3 = 8",
"import numpy as np\nunits = 9\nprice = 2.5\nprint(units * price)\nprint(type(price))",
"The order in which cells are executed affects available variables; rerun from the top when the environment is inconsistent.",
"Which operation raises 2 to the third power in Python?","2 ^ 3|2 ** 3|2 * 3",1,
"Lecture 1 handout, pp. 31–38 (Google Colab and Python recap)");
add("m12",1,"Comparisons, if/else and for loops","How can code make a choice or repeat work?",
"Comparison operators ask whether something is true: '==', '!=', '>=', '<='. 'if' checks a condition and chooses a branch; 'else' handles another case. A 'for' loop repeats a block for each item in a list. Indentation tells Python which statements belong together.",
"Conditional flow and iteration let a program implement simple data validation and transformations. Pandas operations may replace explicit loops for table work, but reading basic conditions and loops is essential for interpreting notebook code.",
"A shop might apply a discount only if an order is large enough; a loop checks each order in turn.",
"comparison → Boolean → selected branch",
"for fare in [12, -5, 30]:\n    if fare < 0:\n        print('Invalid fare')\n    else:\n        print('Valid fare')",
"Python uses '==' for comparison and '=' for assignment. Indentation is meaningful.",
"Which statement checks if fare is negative?","if fare < 0:|if fare = 0:|for fare < 0:",0,
"Lecture 1 handout, p. 39 (comparison, conditionals and for loops)");
add("m13",1,"Matplotlib plots and chart labels","What do plot(), scatter() and hist() help you see?",
"A line plot connects measurements; a scatterplot shows individual data points; a histogram groups values into ranges. Plot labels and titles explain what an axis measures. Always inspect whether you're looking at observations, model predictions or both before interpreting a curve.",
"Matplotlib's pyplot interface includes plt.plot, plt.scatter, plt.hist, plt.xlabel, plt.ylabel, plt.title and plt.show. Appropriate chart type depends on the structure of the observations and the question, and chart conventions should not be mistaken for causal evidence.",
"A scatterplot shows each ice-cream sales day as a dot; a fitted regression line is a separate visual summary.",
"X-axis = predictor; Y-axis = target (for a basic regression plot)",
"import matplotlib.pyplot as plt\nplt.scatter([1,2,3],[5,7,6])\nplt.xlabel('Day')\nplt.ylabel('Sales')\nplt.title('Three sales observations')\nplt.show()",
"A chart without labelled axes makes it easy to misread units or confuse categories and quantities.",
"Which function plots each observation as a separate point?","plt.hist()|plt.scatter()|plt.show()",1,
"Lecture 1 handout, p. 40 (plotting recap)");
// LECTURE 2 — official handout: raw data -> preprocessing -> feature engineering.
add("d201",2,"The raw-data-to-insight pipeline","Why do business datasets need preparation before modelling?",
"Machine learning begins with raw records, not model code. Preprocessing catches invalid or missing values. Feature engineering transforms the cleaned records into useful model inputs. Only then can modelling create insights. The correct steps depend on what each business variable represents.",
"The lecture's process is raw data → data preprocessing → prepared data → feature engineering → engineered features → modelling → insights. Inspection and domain expertise govern each transition.",
"Making a cake: inspect ingredients, prepare them, combine them correctly, then bake.",
"raw data → cleaned data → engineered features → modelling → insights",
"import pandas as pd\ndf = pd.read_csv('Titanic.csv')\nprint(df.head())",
"Do not start tuning algorithms before verifying what the rows and columns actually mean.",
"What normally happens before feature engineering?","Data preprocessing|Model deployment|Discarding the target",0,
"Lecture 2 handout, pp. 2–4 (learning objectives and ML pipeline)");
add("d202",2,"Titanic observations and variable types","Can a column containing numbers still be categorical?",
"Yes. An observation is one passenger, while a feature is a recorded characteristic. The lecture's Titanic dataset contains 893 rows and 11 features. Age and Fare are numerical measurements; Pclass is a category represented by a code even if displayed as a number; Sex is also categorical. A label such as survival is the outcome a future model would predict.",
"Numeric values express measurements or counts; categorical values express group membership. Ordinal categories have an order, while nominal categories do not. Python's dtype alone does not determine the business meaning of a variable.",
"An airline seat class marked 1, 2 or 3 is a group, not automatically a quantity with equal spacing.",
"n observations × p features; Titanic source: 893 × 11",
"print(df.shape)\nprint(df.dtypes)",
"Treating Pclass 3 as three times Pclass 1 is not justified merely by the codes.",
"Which Titanic column represents a category despite a possible numeric code?","Fare|Pclass|Age",1,
"Lecture 2 handout, pp. 5–7 (Titanic dataset and variable types)");
add("d203",2,"Inspect a DataFrame before cleaning","How can you find bad values without staring at every row?",
"Use df.head() to preview rows; df.info() to inspect columns, types and non-missing counts; df.describe() to summarise numerical columns; and df['column'].unique() to examine categories and unexpected spellings. These operations help identify where to investigate, not automatically decide what to delete.",
"Diagnostic methods identify value distributions, object dtypes, missing entries and potentially impossible records. A sound audit also checks duplicates and category frequencies, while retaining the original dataset for reproducibility.",
"Before checking a warehouse's stock accuracy, sample labels, count categories and look for impossible quantities.",
"data audit = types + missingness + ranges + categories",
"print(df.head())\nprint(df.info())\nprint(df.describe())\nprint(df['Embarked'].unique())",
"df.describe() mainly summarises numerical columns by default; it will not expose every problematic text category.",
"Which operation is most useful for finding unusual text categories?","df['Embarked'].unique()|df.shape[0] + 1|df.head().mean()",0,
"Lecture 2 handout, pp. 5, 10 and 13 (head, info, describe, unique)");
add("d204",2,"Invalid values and outlier diagnosis","Is every extreme data point a mistake that must be removed?",
"No. A negative passenger Fare is suspicious because a fare should not be negative. But a very expensive fare might be real. Use summary statistics and filters to find invalid records. Outliers can be explored using boxplots, z-scores or anomaly detectors; use business knowledge to distinguish mistakes from unusual but genuine observations.",
"The handout uses a corrupt Titanic record in row 892 as an example for filtering and dropping. It distinguishes erroneous entries from legitimate extremes and introduces boxplots, z-score magnitudes above 3, and anomaly detection as ways to flag—not prove—outliers.",
"A 10,000-euro receipt may be a luxury purchase or a misplaced decimal point; context matters.",
"z = (value − mean) / standard deviation",
"bad = df[df['Fare'] < 0]\nprint(bad)\n# Drop only confirmed corrupt rows after inspection",
"Do not delete every observation whose z-score exceeds 3; the underlying distribution and business context matter.",
"Which is a suitable reason to investigate a Titanic Fare entry?","Fare is negative|Fare is higher than average|Passenger is in first class",0,
"Lecture 2 handout, pp. 9–13 (invalid data, outliers and Titanic example)");
add("d205",2,"Duplicate rows and uninformative features","Why can duplicated or meaningless columns mislead a model?",
"Duplicate observations can over-weight a repeated record. Columns that are constant for every row provide no variation, while purely arbitrary unique identifiers may add no useful information. The lecture introduces dropping rows/columns, checking duplicates and removing confirmed non-informative features.",
"Pandas supports duplicated() and drop_duplicates() for repeated records, and drop(columns=...) for fields. Do not remove unique identifier columns automatically: some identifiers carry meaningful grouping or linkage information. Make removal decisions using domain knowledge.",
"If a customer buys twice, two rows may be correct; if the same sale was entered twice by accident, it may be a duplicate.",
"number of unique values = 1 → constant feature",
"print(df.duplicated().sum())\nclean = df.drop_duplicates()\nclean = clean.drop(columns=['PassengerId'])",
"Two passengers may share a name or ticket; duplicate names are not the same as duplicate rows.",
"Which check tests whether complete rows repeat?","df.duplicated()|df['Name'].unique()|df.describe()",0,
"Lecture 2 handout, pp. 13–15 (non-informative features and duplicates)");
add("d206",2,"Min-max normalization versus standard scaling","Why transform numerical columns to comparable scales?",
"A Fare measured in tens of currency units and an Age measured in years use different ranges. Min-max normalization often maps a chosen training range into 0 to 1; standard scaling centres a feature around mean 0 and scales it to standard deviation 1. Some models benefit, but a decision tree typically does not need the same scaling.",
"The lecture uses 'normalizing' for min-max [0,1] and 'scaling' for standardization (mean 0, standard deviation 1), and mentions regressions/PCA versus trees. Later, the proper supervised pipeline should fit preprocessing statistics on training data only.",
"Comparing kilometres and metres becomes easier after using consistent units; a model may also benefit from comparable scales.",
"minmax = (x−min)/(max−min); standard = (x−mean)/std",
"from sklearn.preprocessing import MinMaxScaler, StandardScaler\nscaler = StandardScaler()\n# Fit on training rows only when a supervised split exists",
"An unseen value can fall outside [0,1] if min-max scaling was learned from training data; not every regression requires scaling.",
"Which transform aims for mean 0 and standard deviation 1?","StandardScaler|OneHotEncoder|drop_duplicates",0,
"Lecture 2 handout, pp. 16–17 (scaling and normalizing)");
add("d207",2,"MCAR, MAR and MNAR: why data goes missing","Can missingness itself contain information?",
"Yes. Missing completely at random (MCAR) has no systematic relationship to observed or unobserved values. Missing at random (MAR) can depend on other observed features. Missing not at random (MNAR) can depend on the missing value itself or factors not accounted for, making repair harder. These mechanisms affect whether simple replacement is trustworthy.",
"Distinguish MCAR, MAR and MNAR conceptually: 'at random' in MAR does not mean there is no pattern; it means the mechanism may be explained by observed data, conditional on those variables. The handout notes MNAR can be harder to mitigate and may benefit from more features.",
"If older passengers are less likely to report a value, missingness may follow age rather than pure chance.",
"MCAR: independent; MAR: related to observed data; MNAR: related to missing/unseen factors",
"print(df[['Age','Embarked','Cabin']].isna().sum())",
"Missingness is not always innocuous. Do not automatically replace every gap with an overall average.",
"Which type can depend on other recorded variables?","MCAR only|MAR|None of them",1,
"Lecture 2 handout, p. 21 (three missing-data mechanisms)");
add("d208",2,"Numerical missing values: delete, estimate or impute","How might you fill an unknown passenger age?",
"First identify the missing cells. Options include dropping rows or a mostly empty column, replacing missing numbers with mean/median or extrema, finding similar observations and using their value, sampling from neighbours, or estimating a value with regression. More sophisticated methods can incorporate uncertainty. Pick the method based on the business problem.",
"The handout moves from simpler methods to nearest-observation and regression-based imputation. For Titanic Age, it demonstrates estimating from similar observations and using sklearn.impute. For a reliable pipeline, learn imputers only from training rows and retain a missingness indicator when informative.",
"If a form has a blank age, you might estimate it using similar records rather than assuming everyone is the same age.",
"mean imputation: missing Age ← training-set mean Age",
"from sklearn.impute import SimpleImputer\nimputer = SimpleImputer(strategy='median')\n# Fit on observed ages in the training split",
"Replacing every missing age with one value erases natural variation; evaluate the consequences for the task.",
"Which method uses other passengers' attributes to estimate a missing age?","Nearest-neighbour imputation|Drop all data automatically|One-hot encoding",0,
"Lecture 2 handout, pp. 18–19 and 22 (numerical imputation)");
add("d209",2,"Categorical missing values and the Titanic example","How should a missing embarkation port be represented?",
"For a categorical column, one simple option is filling with the most common category; another is introducing an explicit 'Missing' category. You can also drop affected rows or use similar records to predict the category. In Titanic, the lecture proposes filling missing Embarked with the most frequent 'S', while dropping Cabin because too many values are missing.",
"Choose numerical and categorical imputation methods separately, rather than averaging arbitrary category codes. The handout introduces simple replacements, neighbour-based methods and classification-based estimation. As with all learned preprocessing, avoid using test rows to calculate statistics.",
"If one student leaves the campus field blank, recording 'Unknown' might be safer than inventing the average campus.",
"mode = most frequent nonmissing category",
"from sklearn.impute import SimpleImputer\nimputer = SimpleImputer(strategy='most_frequent')\n# Example: learn the usual embarkation value on training rows",
"The most frequent value is not necessarily the true missing value; communicate this uncertainty.",
"What is the lecture's illustrative replacement for missing Embarked?","S|The mean age|A negative fare",0,
"Lecture 2 handout, pp. 20–22 (categorical imputation and Titanic decisions)");
add("d210",2,"Ordinal encoding versus one-hot encoding","Why should different categories be encoded differently?",
"Some categories have a meaningful order, like first/second/third class. Others, such as departure ports S, C and Q, do not have an intrinsic ranking. Ordinal encoding assigns codes in an intended order; one-hot encoding makes separate 0/1 indicator columns. Sometimes one redundant one-hot column is dropped.",
"The lecture contrasts Pclass (ordinal) with Embarked (nominal) and illustrates one-hot coding plus a dropped redundant column. For linear regression with an intercept, including all category dummies may cause perfect multicollinearity; dropping one provides a reference category.",
"An exam grade A/B/C can be ordered, but three office locations should not become 1/2/3 as if one location is twice another.",
"Embarked=S → [1,0]; C → [0,1]; Q → [0,0] when Q is reference",
"import pandas as pd\nports = pd.DataFrame({'Embarked':['S','C','Q']})\nprint(pd.get_dummies(ports, columns=['Embarked']))",
"An integer label for a nominal category can accidentally imply meaningful distance between categories.",
"Which feature is nominal in the lecture example?","Embarked|Pclass|Age",0,
"Lecture 2 handout, pp. 24–25 (ordinal, nominal and one-hot encoding)");
add("d211",2,"Convert numbers into categories using bins","When might exact numerical detail be less useful than a range?",
"Binning or bucketization groups continuous or count values into ranges such as age bands. Each bin becomes a category and can be summarised, counted or used as a transformed feature. Choose boundaries intentionally; information may be lost when distinct values fall in the same bin.",
"The handout introduces numerical-to-categorical conversion through bucketization and aggregation. In pandas, cut() supports specified boundaries and qcut() supports quantile-based groups, but their behaviour differs with repeated values and boundaries.",
"A customer aged 31 might be grouped into '30–39' for a simple marketing segment.",
"age → age group; many values → fewer categories",
"ages = pd.Series([18,27,42,63])\nlabels = pd.cut(ages, bins=[0,29,49,120], labels=['Young','Middle','Older'])\nprint(labels)",
"A histogram already has bins, but choosing category cutoffs can erase information near a boundary.",
"Which operation converts numerical ages into age groups?","Binning|One-hot encoding nominal ports|Dropping duplicates",0,
"Lecture 2 handout, p. 26 (numerical-to-categorical binning)");
add("d212",2,"Feature selection versus dimension reduction","Is removing columns the same as combining columns?",
"No. Feature selection picks a useful subset of existing features. Dimension reduction creates fewer new dimensions that combine information from multiple old features. The lecture previews both and reserves dimension reduction methods for Lecture 8, so we focus here on distinguishing the ideas.",
"Feature selection operates in the original feature space; dimensionality reduction maps X to a lower-dimensional representation, for example a projection. The Lecture 2 treatment is introductory only; methods and mathematical details belong to future supplied material.",
"Selecting only three useful ingredients is different from blending ten ingredients into two sauces.",
"selection: choose existing columns; reduction: construct new dimensions",
"selected = df[['Fare','Age']]\nprint(selected.columns)",
"Do not claim that PCA or other algorithms were taught in detail in Lecture 2; they were previewed for Lecture 8.",
"Which creates new combined features rather than simply picking columns?","Dimension reduction|Feature selection|Removing one duplicate row",0,
"Lecture 2 handout, p. 27 (feature selection and dimension reduction preview)");
add("d213",2,"Feature transformations and interactions","How can two existing columns produce a better predictor?",
"Transformations apply mathematical changes to one feature, such as taking a power, log, unit conversion or adding a constant. Interactions combine information from multiple features, such as passengers' siblings/spouses and parents/children travelling together. These can help a model represent relationships it could not express using only the original columns.",
"Feature transformations change the representation of predictors; interaction features involve the joint effect of two or more variables. The lecture mentions converting a 1912 Fare into today's euros and combining Parch and SibSp. Any conversion needs a defined exchange/inflation assumption rather than an invented fixed multiplier.",
"A family-size field can combine two related counts, while an adjusted fare converts an old currency amount into units relevant today.",
"family_size = SibSp + Parch + 1",
"df['FamilySize'] = df['SibSp'] + df['Parch'] + 1\nprint(df[['SibSp','Parch','FamilySize']].head())",
"Do not confuse a feature interaction with an automatic causal relationship. Adding features can also overfit.",
"Which new column uses two existing Titanic counts?","FamilySize from SibSp and Parch|Embarked copied unchanged|Deleting all rows",0,
"Lecture 2 handout, p. 28 (feature transforms and interactions)");
add("d214",2,"Titanic detective: an end-to-end preprocessing check","What sequence should you follow before training a model on Titanic?",
"Read the CSV; inspect rows, types and summary statistics; look for impossible Fare values; distinguish suspicious outliers from errors; identify duplicates and unhelpful columns; measure missing values; decide whether to drop Cabin or fill Age/Embarked; encode categories and engineer useful features. Every change should have a stated reason and be checked.",
"This review deliberately stays within the handout's scope: preprocessing and feature engineering, not a survival classifier. The complete supervised train/test preprocessing pipeline is introduced in Lecture 3, and tree-based classification is on the later course roadmap.",
"Like a detective, you preserve evidence, document each correction and only then propose an explanation.",
"audit → clean → impute → encode/transform → engineer → inspect",
"print(df.shape)\nprint(df.isna().sum())\nprint(df.duplicated().sum())\nprint(df['Fare'].describe())",
"A cleaned-looking DataFrame is not automatically ready for unbiased training; inspect for leakage and feature meaning.",
"Which task comes first when opening the raw Titanic file?","Inspect its structure and data quality|Choose a deep tree model|Assume missing values are zero",0,
"Lecture 2 handout, pp. 3–29 (integrated workflow review)");
// LECTURE 3 — explicit regression/classification distinction from the handout.
add("r33",3,"Supervised learning: regression or classification?","How do you know whether a prediction should be a number or category?",
"In supervised learning, each example has a known target (label). Regression predicts a number such as sales or price. Classification predicts a category such as survived/not survived. Before choosing a model, write down the target and decide what kind of answer it has.",
"The output type frames the model and evaluation: a numerical target suggests regression metrics, while a categorical target suggests classification methods and metrics. A binary label represented as 0/1 is still a category if the task is to identify a class.",
"Predicting how many tickets sell is regression; predicting whether a ticket is fraudulent is classification.",
"numeric target → regression; categorical target → classification",
"target_name = 'Sales'\nprint('Predict the number in',target_name)",
"Do not decide regression versus classification solely from whether the label is stored as an integer.",
"Predicting if a passenger survived is generally which task?","Classification|Regression|Clustering",0,
"Lecture 3 handout, pp. 3–5 (supervised learning and regression versus classification)");

var lectureSections={
1:[
 {id:"l1-purpose",title:"1. Course purpose and core vocabulary",ids:["m14","m1","m2","m9","m10"],coverage:"Lecture 1 slides 4–21 and 23–26"},
 {id:"l1-python",title:"2. Python and coding fundamentals",ids:["m3","m11","m12","m4","m13"],coverage:"Lecture 1 slides 31–41; notebook-style Python practice"}
],
2:[
 {id:"l2-raw",title:"1. Inspect raw data and identify variable types",ids:["d201","d202","m5","d203"],coverage:"Lecture 2 slides 2–10"},
 {id:"l2-clean",title:"2. Detect and correct data-quality problems",ids:["d204","d205","m6","d207","d208","d209"],coverage:"Lecture 2 slides 9–15, 18–22"},
 {id:"l2-encode",title:"3. Scale data and encode numerical/categorical fields",ids:["m7","d206","d210","d211"],coverage:"Lecture 2 slides 16–17, 24–26"},
 {id:"l2-engineer",title:"4. Engineer useful features and review the pipeline",ids:["m8","d212","d213","d214"],coverage:"Lecture 2 slides 27–29 and exercise context"}
],
3:[
 {id:"l3-linear",title:"1. Supervised regression and the Gelato linear model",ids:["r01","r33","r02","r03","r04","r05","r06","r07","r08","r09","r30","r10","r11","r29","r31","r13"],coverage:"Lecture 3 slides 3–15; exercise parts 1–2, with mathematical/code-reading supplements"},
 {id:"l3-polynomial",title:"2. Polynomial regression and model complexity",ids:["r16","r17","r18","r19","r20","r27"],coverage:"Lecture 3 slides 16–25; exercise part 3"},
 {id:"l3-validation",title:"3. Supervised learning pipeline and target leakage",ids:["r14","r15","r22","r28"],coverage:"Lecture 3 slides 26–39"},
 {id:"l3-extensions",title:"4. Optional: evaluation and advanced regression extensions",ids:["r12","r21","r23","r24","r25","r26","r32"],coverage:"Independent supplementary teaching; not verified as covered in Lecture 3"}
]
};
var existing=new Set(C.lessons.map(function(l){return l.id}));
for(var i=0;i<additions.length;i++){var n=additions[i];if(existing.has(n.id))throw Error("Duplicate lesson id "+n.id);existing.add(n.id);C.lessons.push(n)}
var mapped=new Set();
for(var n=1;n<=3;n++){
 for(var si=0;si<lectureSections[n].length;si++){
  var section=lectureSections[n][si];
  for(var li=0;li<section.ids.length;li++){
   var id=section.ids[li];if(mapped.has(id))throw Error("Lesson mapped twice: "+id);mapped.add(id);
   var item=C.lessons.find(function(l){return l.id===id});
   if(!item)throw Error("Missing lesson "+id);
   if(item.lecture!==n)throw Error("Wrong lecture for "+id);
   item.sectionId=section.id;item.sectionTitle=section.title;
   item.topicNumber=li+1;
   item.kind=section.id==="l3-extensions"||/^supplement|^optional/i.test(item.source)?"supplement":"lecture";
  }
 }
}
for(var l of C.lessons)if(l.lecture<=3&&!mapped.has(l.id))throw Error("Unmapped lesson: "+l.id);
C.lessons.sort(function(a,b){
 if(a.lecture!==b.lecture)return a.lecture-b.lecture;
 var secs=lectureSections[a.lecture],aIdx=secs.findIndex(function(s){return s.id===a.sectionId}),bIdx=secs.findIndex(function(s){return s.id===b.sectionId});
 if(aIdx!==bIdx)return aIdx-bIdx;
 return secs[aIdx].ids.indexOf(a.id)-secs[bIdx].ids.indexOf(b.id);
});
var displayNames={
1:"Course introduction, ML/optimization and Python",
2:"Data preprocessing and feature engineering",
3:"Supervised learning: linear/polynomial regression",
4:"Classification: logistic regression",
5:"Tree-based methods",
6:"Extensions of tree-based methods",
7:"STC case",
8:"Dimension reduction",
9:"Clustering and segmentation",
10:"Boats (A) case",
11:"Linear programming",
12:"Integer programming",
13:"SFB integration planning (A)",
14:"SFB integration planning (B)",
15:"SFB integration planning (C)"
};
C.lectures.forEach(function(l){l.title=displayNames[l.id]||l.title;l.available=l.id<=3;l.sourceStatus=l.available?"Sourced lessons available":"Awaiting lecture-specific handout";l.sections=lectureSections[l.id]||[]});
C.lectureSections=lectureSections;
C.coverageMatrix=[
 {lecture:1,source:"MLO_Lecture_1_Handouts.pdf",outcomes:["Course purpose, roadmap and distinguishing ML from optimization","Supervised versus unsupervised learning and the definition-dependent AI label","Generative AI and LLMs","Colab and Python values, types, imports, conditionals, loops, lists, dictionaries, arrays, DataFrames and plotting"],available:true},
 {lecture:2,source:"MLO_Lecture_2_Handouts.pdf",outcomes:["Raw-data/feature-engineering workflow and Titanic observation types","Corrupt values, outliers, duplicates and low-information features","Normalization, standard scaling and use cases","MCAR/MAR/MNAR and numerical/categorical missing-value handling","Ordinal versus nominal encoding, one-hot dummies and binning","Feature selection, dimension reduction preview, transformations and interactions"],available:true},
 {lecture:3,source:"MLO_Lecture_3_Prelecture.pdf",outcomes:["Supervised regression versus classification and choosing a label","Gelato dataset inspection, scatterplots and fitted linear regression","Polynomial features and complexity/overfitting","Train/validation/test roles and generalization","Target leakage and consistent preprocessing"],available:true}
];
})();