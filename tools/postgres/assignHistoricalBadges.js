var Sails = require( 'sails' );
var async = require( 'async' );

Sails.lift( {}, function initSails ( err, sails ) {

  if ( err ) { console.error( new Error( err ) ); }

  // use nested async loops because the .findOrCreate() isn't
  // transactional, which means that at a high frequency it
  // doesn't ensure that duplicate records don't get created
  Task.find( { state: 'completed' } ).populate( 'tags' ).exec( function findTasks ( err, tasks ) {

    if ( err ) { console.error( new Error( err ) ); }

    var taskSeries = tasks.map( function mapTaskToSeries ( task, taskIndex ) {

      // Start the counter at one instead of zero
      taskIndex++;

      return function ( doneWithTask ) {

        console.log( 'Assigning badges for %d of %d tasks.', taskIndex, tasks.length );

        Volunteer.find( { taskId: task.id } ).exec( function findVolunteers ( err, volunteers ){

          if ( err ) { console.error( new Error( err ) ); }

          console.log( '-- Found %d volunteers for Task ID %d', volunteers.length, task.id );

          var volunteerSeries = volunteers.map( function mapVolunteersToSeries ( vol ) {

            return function ( doneWithVolunteer ) {

              console.log( '---- Updating badge for User ID %d', vol.userId );

              User.findOne( { id: vol.userId } ).exec( function findSingleUser ( err, user ) {

                if ( err ) { console.error( new Error( err ) ); }
                user.taskCompleted( task, { silent: true } );
                Badge.awardForTaskPublish( [ task ], task.userId, { silent: true } );

                // Because `taskCompleted` is non-transactional, we'll need to wait
                // an arbitrary amount before completing the current volunteer series.
                setTimeout( function () { doneWithVolunteer(); }, 500 );

              } );

            };

          } );

          async.series( volunteerSeries, function completeVolunteerSeries ( err, result ) {

            if ( err ) { console.error( new Error( err ) ); }

            console.log( 'Done with volunteer series.' );
            console.log( '' );

            doneWithTask();

          } );

        } );

      };

    } );

    async.series( taskSeries, function completeTaskSeries ( err, result ) {

      if ( err ) { console.error( new Error( err ) ); }

      console.log( 'Done with task series.' );
      console.log( '' );

      sails.lower();

      console.log( 'You can safely hit [ Ctrl + C ] to terminate the script.' );

    } );

  } );

} );
