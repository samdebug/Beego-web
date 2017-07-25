package errs

import (
	"errors"
)

var LibraryNotFound = errors.New("library not found")

var VideoNotFound = errors.New("video not found")

var MissionNotFound = errors.New("mission not found")

var NotInAnyLibrary = errors.New("have pictures not in any library")
