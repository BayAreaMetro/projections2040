## Variable renames

library(dplyr)
library(datasets)
library(tidyr)
library("WriteXLS")
library(reshape2)
library(readr)
library(lettercase)
library(here)

###########
######Make City Variables Human readable
##########

City <- read_csv(here("data/projectionsdata_juris.csv"), col_types = cols(X1 = col_skip()))

#Population
City$Variable <- gsub("gqpop","Population in Group Quarters", City$Variable)
City$Variable <- gsub("hhpop","Household Population", City$Variable)
City$Variable <- gsub("\\<age0004","Population Age Under 4", City$Variable)
City$Variable <- gsub("\\<age0519","Population Age 5 thru 19", City$Variable)
City$Variable <- gsub("\\<age2044","Population Age 20 thru 44", City$Variable)
City$Variable <- gsub("\\<age4564","Population Age 45 thru 64", City$Variable)
City$Variable <- gsub("\\<age65p","Population Age 65 and Over", City$Variable)
#Female Age
City$Variable <- gsub("Female_age0004","Female Population Age Under 4", City$Variable)
City$Variable <- gsub("Female_age0509","Female Population Age 5 thru 9", City$Variable)
City$Variable <- gsub("Female_age1014","Female Population Age 10 thru 14", City$Variable)
City$Variable <- gsub("Female_age1519","Female Population Age 15 thru 19", City$Variable)
City$Variable <- gsub("Female_age2024","Female Population Age 20 thru 24", City$Variable)
City$Variable <- gsub("Female_age2529","Female Population Age 25 thru 29", City$Variable)
City$Variable <- gsub("Female_age3034","Female Population Age 30 thru 34", City$Variable)
City$Variable <- gsub("Female_age3539","Female Population Age 35 thru 39", City$Variable)
City$Variable <- gsub("Female_age4044","Female Population Age 40 thru 44", City$Variable)
City$Variable <- gsub("Female_age4549","Female Population Age 45 thru 49", City$Variable)
City$Variable <- gsub("Female_age5054","Female Population Age 50 thru 54", City$Variable)
City$Variable <- gsub("Female_age5559","Female Population Age 55 thru 59", City$Variable)
City$Variable <- gsub("Female_age6064","Female Population Age 60 thru 64", City$Variable)
City$Variable <- gsub("Female_age6569","Female Population Age 65 thru 69", City$Variable)
City$Variable <- gsub("Female_age7074","Female Population Age 70 thru 74", City$Variable)
City$Variable <- gsub("Female_age7579","Female Population Age 75 thru 79", City$Variable)
City$Variable <- gsub("Female_age8084","Female Population Age 80 thru 84", City$Variable)
City$Variable <- gsub("Female_age85p","Female Population Age 85 and Over", City$Variable)
#Male Age
City$Variable <- gsub("Male_age0004","Male Population Age Under 4", City$Variable)
City$Variable <- gsub("Male_age0509","Male Population Age 5 thru 9", City$Variable)
City$Variable <- gsub("Male_age1014","Male Population Age 10 thru 14", City$Variable)
City$Variable <- gsub("Male_age1519","Male Population Age 15 thru 19", City$Variable)
City$Variable <- gsub("Male_age2024","Male Population Age 20 thru 24", City$Variable)
City$Variable <- gsub("Male_age2529","Male Population Age 25 thru 29", City$Variable)
City$Variable <- gsub("Male_age3034","Male Population Age 30 thru 34", City$Variable)
City$Variable <- gsub("Male_age3539","Male Population Age 35 thru 39", City$Variable)
City$Variable <- gsub("Male_age4044","Male Population Age 40 thru 44", City$Variable)
City$Variable <- gsub("Male_age4549","Male Population Age 45 thru 49", City$Variable)
City$Variable <- gsub("Male_age5054","Male Population Age 50 thru 54", City$Variable)
City$Variable <- gsub("Male_age5559","Male Population Age 55 thru 59", City$Variable)
City$Variable <- gsub("Male_age6064","Male Population Age 60 thru 64", City$Variable)
City$Variable <- gsub("Male_age6569","Male Population Age 65 thru 69", City$Variable)
City$Variable <- gsub("Male_age7074","Male Population Age 70 thru 74", City$Variable)
City$Variable <- gsub("Male_age7579","Male Population Age 75 thru 79", City$Variable)
City$Variable <- gsub("Male_age8084","Male Population Age 80 thru 84", City$Variable)
City$Variable <- gsub("Male_age85p","Male Population Age 85 and Over", City$Variable)

#Households
City$Variable <- gsub("tothh","Total Households", City$Variable)
City$Variable <- gsub("mfdu","Multifamily Dwelling Units", City$Variable)
City$Variable <- gsub("sfdu","Single Family Dwelling Units", City$Variable)

#Income
#AO: deprecated
# City$Variable <- gsub("hhincq1","Household Income Less than $30k", City$Variable)
# City$Variable <- gsub("hhincq2","Household Income $30k to $59.9k", City$Variable)
# City$Variable <- gsub("hhincq3","Household Income $60k to $99.9k", City$Variable)
# City$Variable <- gsub("hhincq4","Household Income $100k and Above", City$Variable)

#Jobs
City$Variable <- gsub("othempn","Other", City$Variable)
City$Variable <- gsub("empres","Employed Residents", City$Variable)
City$Variable <- gsub("fpsempn","Finance and Professional Services", City$Variable)
City$Variable <- gsub("herempn","Health and Educational Services", City$Variable)
City$Variable <- gsub("mwtempn","Manufacturing and Wholesale", City$Variable)
City$Variable <- gsub("retempn","Retail", City$Variable)
City$Variable <- gsub("agrempn","Agriculture and Natural Resources", City$Variable)

###########
######End Rename City Variables
##########

###########
######End Rename City Variables
##########

# #Check Uniqueness
# unique(SSA$Variable)
# unique(City$Variable)
# unique(PDA$Variable)

#Add Category Field using values from Concept
SSA$Category <- SSA$Concept
City$Category <- City$Concept
# PDA$Category <- PDA$Concept



#Update Category attributes
#Demographics See url:https://abag.ca.gov/planning/research/forecasts.html for example
SSA$Category <- gsub("Employed Residents","Demographics",SSA$Category)
# City$Category <- gsub("Employed Residents","Demographics",City$Category)
# PDA$Category <- gsub("Employed Residents","Demographics",PDA$Category)

#Househ. by Inc. Quartile --> Income
SSA$Category <- gsub("Househ. by Inc. Quartile","Household Income",SSA$Category)
# City$Category <- gsub("Househ. by Inc. Quartile","Household Income",City$Category)
# PDA$Category <- gsub("Househ. by Inc. Quartile","Household Income",PDA$Category)

#Population by Age --> Age Demographics
SSA$Category <- gsub("Population by Age","Population by Age",SSA$Category)
City$Category <- gsub("Population by Age","Population by Age",City$Category)
# PDA$Category <- gsub("Population by Age","Population by Age",PDA$Category)

#Population by Gender, Age --> Age Demographics
SSA$Category <- gsub("Population by Gender, Age","Population by Gender and Age",SSA$Category)
City$Category <- gsub("Population by Gender, Age","Population by Gender and Age",City$Category)
# PDA$Category <- gsub("Population by Gender, Age","Population by Gender and Age",PDA$Category)

#Units --> Housing Units
SSA$Category <- gsub("Units","Housing Units",SSA$Category)
City$Category <- gsub("Units","Housing Units",City$Category)
# PDA$Category <- gsub("Units","Housing Units",PDA$Category)

#Population --> Total Population
SSA$Category <- gsub("Population","Total Population",SSA$Category)
City$Category <- gsub("Population","Total Population",City$Category)
# PDA$Category <- gsub("Population","Total Population",PDA$Category)

#Jobs --> Total Jobs
SSA$Category <- gsub("Jobs","Total Jobs",SSA$Category)
City$Category <- gsub("Jobs","Total Jobs",City$Category)
# PDA$Category <- gsub("Jobs","Total Jobs",PDA$Category)

# SSA$Category <- gsub("Households","Households",SSA$Category)
# City$Category <- gsub("Households","Households",City$Category)
# PDA$Category <- gsub("Households","Households",PDA$Category)

#Fix source Values
#modeled --> Modeled
SSA$source <- gsub("modeled","Modeled",SSA$source)
City$source <- gsub("modeled","Modeled",City$source)
# PDA$source <- gsub("modeled","Modeled",PDA$source)

#baseyear --> Base Year
SSA$source <- gsub("baseyear","Base Year",SSA$source)
City$source <- gsub("baseyear","Base Year",City$source)
# PDA$source <- gsub("baseyear","Base Year",PDA$source)

#estimate --> Estimate
SSA$source <- gsub("estimate","Estimate",SSA$source)
City$source <- gsub("estimate","Estimate",City$source)
# PDA$source <- gsub("estimate","Estimate",PDA$source)

#Check Values
#unique(City$Category)

#Round Values
SSA$value <- round(SSA$value, digits = 0)
City$value <- round(City$value, digits = 0)
# PDA$value <- round(PDA$value, digits = 0)

#Fix Sort Order for County Jurisdictions
SortOrderSSA <- SSA %>%
  group_by(county, SSA) %>%
  tally() %>%
  mutate(RecID = 1:n())
SortOrderCity <- City %>%
  group_by(county, juris) %>%
  tally() %>%
  mutate(RecID = 1:n())
#setwd("~/Documents/GitHub/projections2040/Data")
WriteXLS(SortOrderSSA, "SSA_List.xls")
WriteXLS(SortOrderCity, "City_List.xls")
rm(SortOrderSSA)
# Adds Sort Field (RecID)
SSA <- merge(SSA, SortOrderSSA)
City <- merge(City, SortOrderCity)

#Check Unique Categories
unique(SSA$Category)

CatSSA <- SSA %>% 
  group_by(Category, Variable) %>%
  tally()

CatCity <- City %>% 
  group_by(Category, Variable) %>%
  tally()

#Export Tables for Socrata Upload

SSA <- read_csv(here("data/projectionsdata_SSA.csv"), col_types = cols(X1 = col_skip()))

WriteXLS(City,here("data/City Forecast.xls"))
#WriteXLS(PDA,"PDA Forecast.xls")
WriteXLS(SSA,here("data/SSA Forecast.xls"))
